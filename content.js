// ==========================================
// 1. TRIE DATA STRUCTURE (Case-Insensitive)
// ==========================================
class TrieNode {
    constructor() { 
        this.children = {}; 
        this.words = new Set(); 
    }
}

class Trie {
    constructor() { this.root = new TrieNode(); }
    
    insert(word) {
        let node = this.root;
        let lowerWord = word.toLowerCase(); 
        
        for (let char of lowerWord) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.words.add(word); 
    }
    
    _findWords(node, results) {
        for (let word of node.words) results.push(word);
        for (let char in node.children) this._findWords(node.children[char], results);
    }
    
    getWordsWithPrefix(prefix) {
        let node = this.root;
        let lowerPrefix = prefix.toLowerCase(); 
        
        for (let char of lowerPrefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        
        let results = [];
        this._findWords(node, results);
        return results;
    }
    
    clear() { this.root = new TrieNode(); }
}

// ==========================================
// 2. EXTENSION STATE
// ==========================================
const trie = new Trie();
let suggestionBox = null;
let currentTypingWord = ""; 
let currentSuggestions = [];
let selectedIndex = 0;
let lastCursorPos = { top: '150px', left: '150px' };

const ignoreList = new Set(['return', 'true', 'false', 'if', 'else', 'for', 'while', 'new', 'this', 'public', 'private', 'class', 'void']);

// ==========================================
// 3. CORE AUTO-SUGGEST LOGIC
// ==========================================
function createSuggestionBox() {
    if (document.getElementById('lc-autosuggest-box')) return;
    suggestionBox = document.createElement('div');
    suggestionBox.id = 'lc-autosuggest-box';
    suggestionBox.style.display = 'none';
    document.body.appendChild(suggestionBox);
}

function preLoadDataTypes() {
    // Safely pull the words from your dictionary.js file
    if (typeof commonDataTypes !== 'undefined') {
        commonDataTypes.forEach(type => trie.insert(type));
    } else {
        console.warn("AutoSuggest: dictionary.js not found or commonDataTypes is undefined.");
    }
}

function extractWordsToTrie() {
    const lineElements = document.querySelectorAll('.view-line');
    if (lineElements.length === 0) return;

    let codeText = "";
    lineElements.forEach(line => { codeText += line.textContent + "\n"; });

    trie.clear();
    
    preLoadDataTypes(); 

    const words = codeText.match(/\b[a-zA-Z_]\w*\b/g) || [];
    words.forEach(word => {
        if (word.length > 2 && !ignoreList.has(word)) trie.insert(word);
    });
}

function closeBox() {
    if (suggestionBox) suggestionBox.style.display = 'none';
    currentTypingWord = "";
    currentSuggestions = [];
    selectedIndex = 0;
}

function insertWord(fullWord) {
    if (!fullWord) return;
    
    const active = document.activeElement;
    if (active && active.tagName === 'TEXTAREA') {
        const end = active.selectionEnd;
        active.setSelectionRange(end - currentTypingWord.length, end);
        document.execCommand('insertText', false, fullWord);
        
        // Smart cursor repositioning for () and <>
        if (fullWord.endsWith('()') || fullWord.endsWith('<>')) {
            setTimeout(() => {
                active.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                    keyCode: 37,
                    which: 37,
                    bubbles: true,
                    cancelable: true
                }));
            }, 10);
        }
    }
    closeBox();
}

function updateHighlight() {
    if (!suggestionBox) return;
    const items = suggestionBox.querySelectorAll('.lc-suggestion-item');
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('lc-selected');
            item.scrollIntoView({ block: 'nearest' }); 
        } else {
            item.classList.remove('lc-selected');
        }
    });
}

function renderSuggestions() {
    if (!suggestionBox) return;
    suggestionBox.innerHTML = '';
    
    currentSuggestions.forEach((suggest, index) => {
        const item = document.createElement('div');
        item.className = 'lc-suggestion-item';
        
        if (index === selectedIndex) item.classList.add('lc-selected');
        
        const lowerSuggest = suggest.toLowerCase();
        const lowerTyping = currentTypingWord.toLowerCase();
        
        if (lowerSuggest.startsWith(lowerTyping)) {
            const originalPrefix = suggest.substring(0, currentTypingWord.length);
            const originalSuffix = suggest.substring(currentTypingWord.length);
            item.innerHTML = `<strong>${originalPrefix}</strong>${originalSuffix}`;
        } else {
            item.innerHTML = suggest;
        }
        
        item.onmousedown = (e) => {
            e.preventDefault(); 
            insertWord(suggest);
        };

        suggestionBox.appendChild(item);
    });

    const cursor = document.querySelector('.monaco-editor .cursor') || document.querySelector('.cursors-layer .cursor');
    
    if (cursor) {
        const rect = cursor.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            lastCursorPos = { top: `${rect.bottom + 5}px`, left: `${rect.left}px` };
        }
    }
    
    suggestionBox.style.top = lastCursorPos.top; 
    suggestionBox.style.left = lastCursorPos.left; 
    suggestionBox.style.display = 'block';
}

function handleInput(event) {
    const modifiers = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
    if (modifiers.has(event.key)) return;

    if (suggestionBox && suggestionBox.style.display === 'block') {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
            updateHighlight();
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            updateHighlight();
            return;
        }
        if (event.key === 'Tab') { 
            event.preventDefault();
            event.stopPropagation();
            insertWord(currentSuggestions[selectedIndex]);
            return;
        }
        if (event.key === 'Escape' || event.key === ' ') {
            closeBox();
            return;
        }
    }

    setTimeout(() => {
        const active = document.activeElement;
        
        if (active && active.tagName === 'TEXTAREA') {
            const textBeforeCursor = active.value.substring(0, active.selectionEnd);
            const match = textBeforeCursor.match(/[a-zA-Z0-9_]+$/);
            currentTypingWord = match ? match[0] : "";
        } else {
            currentTypingWord = "";
        }

        if (currentTypingWord.length >= 1) {
            let suggestions = trie.getWordsWithPrefix(currentTypingWord);
            currentSuggestions = suggestions.filter(w => w.toLowerCase() !== currentTypingWord.toLowerCase()).slice(0, 8); 

            if (currentSuggestions.length > 0) {
                if (selectedIndex >= currentSuggestions.length) selectedIndex = 0;
                renderSuggestions();
            } else {
                suggestionBox.style.display = 'none';
            }
        } else {
            closeBox();
        }
    }, 10);
}

document.addEventListener('mousedown', (e) => {
    if (suggestionBox && e.target.id !== 'lc-autosuggest-box' && !e.target.classList.contains('lc-suggestion-item')) {
        closeBox();
    }
});

// ==========================================
// 4. BOOT UP SEQUENCE
// ==========================================
createSuggestionBox();
extractWordsToTrie(); 

setInterval(extractWordsToTrie, 2000);

window.addEventListener('keydown', handleInput, true);