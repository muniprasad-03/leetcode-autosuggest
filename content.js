// ==========================================
// 1. EXTENSION STATE & INITIALIZATION
// ==========================================
// Because trie.js loaded before this file, we can just call 'new Trie()' directly.
const trie = new Trie(); 
let currentLanguage = "unknown"; 
let suggestionBox = null;
let currentTypingWord = ""; 
let currentSuggestions = [];
let selectedIndex = 0;
let lastCursorPos = { top: '150px', left: '150px' };
let wordFrequency = {};

const ignoreList = new Set(['return', 'true', 'false', 'if', 'else', 'for', 'while', 'new', 'this', 'public', 'private', 'class', 'void']);

function preLoadDataTypes(lang) {
    // Pulls from languageData in dictionary.js
    if (typeof languageData !== 'undefined' && languageData[lang] && languageData[lang].keywords) {
        languageData[lang].keywords.forEach(type => trie.insert(type));
    }
}

// ==========================================
// 2. UI SETUP & DOM EXTRACTION
// ==========================================
function createSuggestionBox() {
    if (document.getElementById('lc-autosuggest-box')) return;
    suggestionBox = document.createElement('div');
    suggestionBox.id = 'lc-autosuggest-box';
    suggestionBox.style.display = 'none';
    document.body.appendChild(suggestionBox);
}

function getLeetCodeLanguage() {
    const langButton = document.querySelector('[data-track-load="description_content"]')?.nextElementSibling?.querySelector('button');
    const allButtons = Array.from(document.querySelectorAll('button'));
    const langBtn = allButtons.find(btn => 
        ['C++', 'Java', 'Python', 'Python3', 'MySQL', 'JavaScript'].includes(btn.textContent)
    );

    if (langBtn) return langBtn.textContent.toLowerCase();
    return "unknown";
}

function extractWordsToTrie() {
    const lineElements = document.querySelectorAll('.view-line');
    if (lineElements.length === 0) return;

    // Update global language state
    currentLanguage = getLeetCodeLanguage();

    let codeText = "";
    lineElements.forEach(line => { codeText += line.textContent + "\n"; });

    trie.clear();
    preLoadDataTypes(currentLanguage); 

    // Reset frequencies
    wordFrequency = {};

    // 1. Extract standard variables and words
    const words = codeText.match(/\b[a-zA-Z_]\w*\b/g) || [];
    words.forEach(word => {
        if (word.length > 2 && !ignoreList.has(word)) {
            trie.insert(word);
            // Track Term Frequency (TF)
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });

    // 2. Detect user-defined methods (words followed by an open parenthesis)
    const methods = codeText.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
    for (const match of methods) {
        const methodWord = match[1];
        if (methodWord.length > 2 && !ignoreList.has(methodWord)) {
            const methodSig = methodWord + '()';
            trie.insert(methodSig);
            wordFrequency[methodSig] = (wordFrequency[methodSig] || 0) + 1;
        }
    }

    // Trigger Agentic AI extraction
    if (typeof analyzeProblemWithLocalLLM === 'function') {
        analyzeProblemWithLocalLLM(trie);
    }
}

// ==========================================
// 3. SUGGESTION BOX CONTROLS
// ==========================================
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
        // Highlight the currently typed prefix so it gets overwritten
        active.setSelectionRange(end - currentTypingWord.length, end);
        
        // Inject the full word 
        document.execCommand('insertText', false, fullWord);
        
        // Calculate the exact number of spaces to move backward
        let offset = 0;
        if (fullWord.endsWith('<>()')) {
            offset = 3; // Move back past '>()'
        } else if (fullWord.endsWith('()') || fullWord.endsWith('<>')) {
            offset = 1; // Move back past ')' or '>'
        }

        // CRITICAL FIX: No setTimeout. We fire events synchronously BEFORE the browser paints.
        if (offset > 0) {
            // 1. Instantly move the browser's hidden textarea cursor
            const newPos = active.selectionEnd - offset;
            active.setSelectionRange(newPos, newPos);
            
            // 2. Machine-gun the Left Arrow key to force Monaco to sync perfectly in the same frame
            for (let i = 0; i < offset; i++) {
                active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, bubbles: true }));
                active.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, bubbles: true }));
            }
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

function renderSuggestions(isPrediction = false) {
    if (!suggestionBox) return;
    suggestionBox.innerHTML = '';
    
    currentSuggestions.forEach((suggest, index) => {
        const item = document.createElement('div');
        item.className = 'lc-suggestion-item';
        
        if (index === selectedIndex) item.classList.add('lc-selected');
        
        if (isPrediction) {
            // UI for N-Gram Predictions
            item.innerHTML = `<span style="color:#aaa;">✨ Predict:</span> ${suggest}`;
        } else {
            const lowerSuggest = suggest.toLowerCase();
            const lowerTyping = currentTypingWord.toLowerCase();
            
            if (lowerSuggest.startsWith(lowerTyping)) {
                const originalPrefix = suggest.substring(0, currentTypingWord.length);
                const originalSuffix = suggest.substring(currentTypingWord.length);
                item.innerHTML = `<strong>${originalPrefix}</strong>${originalSuffix}`;
            } else {
                // UI for Levenshtein Fuzzy Matches
                item.innerHTML = `${suggest} <span style="font-size: 10px; color: #888;">(fuzzy)</span>`;
            }
        }
        
        item.onmousedown = (e) => {
            e.preventDefault(); 
            insertWord(suggest);
        };
        suggestionBox.appendChild(item);
    });

    // Calculate dynamic dropdown placement based on the Monaco cursor
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

// ==========================================
// 4. KEYBOARD INTERCEPTION & MASTER LOGIC
// ==========================================
function handleInput(event) {
    const modifiers = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
    if (modifiers.has(event.key)) return;

    if (suggestionBox && suggestionBox.style.display === 'block') {
        if (event.key === 'ArrowDown') {
            event.preventDefault(); event.stopPropagation();
            selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
            updateHighlight(); return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault(); event.stopPropagation();
            selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            updateHighlight(); return;
        }
        if (event.key === 'Tab') { 
            event.preventDefault(); event.stopPropagation();
            insertWord(currentSuggestions[selectedIndex]); return;
        }
        if (event.key === 'Escape') {
            closeBox(); return;
        }
    }

    // Give Monaco editor 10ms to update its internal DOM state
    setTimeout(() => {
        const active = document.activeElement;
        let textBeforeCursor = "";
        
        if (active && active.tagName === 'TEXTAREA') {
            textBeforeCursor = active.value.substring(0, active.selectionEnd);
            const match = textBeforeCursor.match(/[a-zA-Z0-9_]+$/);
            currentTypingWord = match ? match[0] : "";
        } else {
            currentTypingWord = "";
        }

        let suggestions = [];
        let isPrediction = false;

        // 1. Check for Member Completion (e.g. Arrays.s or std::v or Arrays. or std::)
        if (typeof getMemberCompletions === 'function' && typeof languageData !== 'undefined' && languageData[currentLanguage]?.bigrams) {
            const memberCompletions = getMemberCompletions(textBeforeCursor, languageData[currentLanguage].bigrams);
            if (memberCompletions && memberCompletions.length > 0) {
                suggestions = memberCompletions;
                isPrediction = true;
            }
        }

        // 2. If no member completions, and we have a typed word, search Trie/Subsequence/Fuzzy
        if (suggestions.length === 0 && currentTypingWord.length >= 1) {
            // STEP A: Fast Trie Lookup
            suggestions = trie.getWordsWithPrefix(currentTypingWord);
            
            // STEP B: Subsequence / Abbreviation Matcher
            if (suggestions.length < 5 && currentTypingWord.length >= 2) {
                if (typeof getSubsequenceSuggestions === 'function') {
                    const subSeqSugs = getSubsequenceSuggestions(currentTypingWord, trie.getAllWords());
                    suggestions = [...new Set([...suggestions, ...subSeqSugs])];
                }
            }
            
            // STEP C: Fuzzy Fallback (Damerau-Levenshtein)
            if (suggestions.length === 0 && currentTypingWord.length >= 3) {
                if (typeof getFuzzySuggestions === 'function') {
                    suggestions = getFuzzySuggestions(currentTypingWord, trie.getAllWords(), 2);
                }
            }

            // STEP D: Rank suggestions using unified NLP scoring (Prefix, Subsequence, Fuzzy, TF)
            if (suggestions.length > 0 && typeof rankSuggestions === 'function') {
                suggestions = rankSuggestions(suggestions, currentTypingWord, wordFrequency);
            }

            // Filter out exact match
            suggestions = suggestions.filter(w => w.toLowerCase() !== currentTypingWord.toLowerCase());
        }

        // 3. If still no suggestions, check for space-based predictions
        if (suggestions.length === 0 && currentTypingWord.length === 0) {
            if (typeof getPredictiveSuggestions === 'function' && typeof languageData !== 'undefined' && languageData[currentLanguage]?.bigrams) {
                const predictions = getPredictiveSuggestions(textBeforeCursor, languageData[currentLanguage].bigrams);
                if (predictions.length > 0) {
                    suggestions = predictions;
                    isPrediction = true;
                }
            }
        }

        currentSuggestions = suggestions.slice(0, 8);

        if (currentSuggestions.length > 0) {
            if (selectedIndex >= currentSuggestions.length) selectedIndex = 0;
            renderSuggestions(isPrediction);
        } else {
            closeBox();
        }
    }, 10);
}

// Click outside to close
document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!suggestionBox || !target) return;

    const isSuggestionBox = target.id === 'lc-autosuggest-box';
    const isSuggestionItem = target.classList && target.classList.contains('lc-suggestion-item');

    if (!isSuggestionBox && !isSuggestionItem) {
        closeBox();
    }
});

// ==========================================
// 5. BOOT UP SEQUENCE
// ==========================================
createSuggestionBox();
extractWordsToTrie();

setInterval(extractWordsToTrie, 2000);

window.addEventListener('keydown', handleInput, true);