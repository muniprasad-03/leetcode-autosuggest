const trie = new Trie(); 
let currentLanguage = "unknown"; 
let suggestionBox = null;
let currentTypingWord = ""; 
let currentSuggestions = [];
let selectedIndex = 0;
let lastCursorPos = { top: '150px', left: '150px' };
let wordFrequency = {};
let lastParsedCode = "";

function preLoadDataTypes(lang) {
    if (typeof inbuiltKeywords !== 'undefined') {
        inbuiltKeywords.clear();
    }
    if (typeof languageData !== 'undefined' && languageData[lang] && languageData[lang].keywords) {
        languageData[lang].keywords.forEach(type => {
            trie.insert(type);
            if (typeof inbuiltKeywords !== 'undefined') {
                inbuiltKeywords.add(type);
            }
        });
    }
}

function createSuggestionBox() {
    if (document.getElementById('lc-autosuggest-box')) return;
    suggestionBox = document.createElement('div');
    suggestionBox.id = 'lc-autosuggest-box';
    suggestionBox.style.display = 'none';
    document.body.appendChild(suggestionBox);
}

function getLeetCodeLanguage() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const langBtn = allButtons.find(btn => 
        ['C++', 'Java', 'Python', 'Python3', 'MySQL', 'JavaScript'].includes(btn.textContent)
    );
    if (langBtn) return langBtn.textContent.toLowerCase();
    return "unknown";
}

function tokenizeCode(codeText, lang) {
    let cleanText = codeText;
    if (lang === 'python' || lang === 'python3') {
        cleanText = cleanText.replace(/"""[\s\S]*?"""/g, '').replace(/'''[\s\S]*?'''/g, '');
        cleanText = cleanText.replace(/#.*$/gm, '');
    } else {
        cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, '');
        cleanText = cleanText.replace(/\/\/.*$/gm, '');
    }
    cleanText = cleanText.replace(/"(\\.|[^"\\])*"/g, '');
    cleanText = cleanText.replace(/'(\\.|[^'\\])*'/g, '');
    if (lang === 'javascript' || lang === 'js') {
        cleanText = cleanText.replace(/`([\s\S]*?)`/g, '');
    }
    return cleanText;
}

function extractWordsToTrie() {
    const lineElements = document.querySelectorAll('.view-line');
    if (lineElements.length === 0) return;

    currentLanguage = getLeetCodeLanguage();

    let codeText = "";
    lineElements.forEach(line => { codeText += line.textContent + "\n"; });

    if (codeText === lastParsedCode) return;
    lastParsedCode = codeText;

    trie.clear();
    preLoadDataTypes(currentLanguage); 
    
    wordFrequency = {};
    if (typeof languageData !== 'undefined' && languageData[currentLanguage]?.keywords) {
        languageData[currentLanguage].keywords.forEach(keyword => {
            wordFrequency[keyword] = 5; // seed base keyword weights
        });
    }

    const cleanCode = tokenizeCode(codeText, currentLanguage);

    // Extract variables and function words
    const words = cleanCode.match(/\b[a-zA-Z_]\w*\b/g) || [];
    words.forEach(word => {
        if (word.length > 2) {
            trie.insert(word);
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });

    // Detect user-defined methods
    const methods = cleanCode.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
    for (const match of methods) {
        const methodWord = match[1];
        if (methodWord.length > 2) {
            const methodSig = methodWord + '()';
            trie.insert(methodSig);
            wordFrequency[methodSig] = (wordFrequency[methodSig] || 0) + 1;
        }
    }

    if (typeof analyzeProblemWithLocalLLM === 'function') {
        analyzeProblemWithLocalLLM(trie);
    }
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
        
        let offset = 0;
        if (fullWord === '( ) {') {
            offset = 3;
        } else if (fullWord === '(int i = 0; i < ; i++) {' || fullWord === '(let i = 0; i < ; i++) {') {
            offset = 8;
        } else if (fullWord === 'i in range():') {
            offset = 2;
        } else if (fullWord.endsWith('<>()')) {
            offset = 3;
        } else if (fullWord.endsWith('()') || fullWord.endsWith('<>')) {
            offset = 1;
        }

        if (offset > 0) {
            const newPos = active.selectionEnd - offset;
            active.setSelectionRange(newPos, newPos);
            // Sync Monaco caret
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
            item.innerHTML = suggest;
        } else {
            const lowerSuggest = suggest.toLowerCase();
            const lowerTyping = currentTypingWord.toLowerCase();
            
            if (lowerSuggest.startsWith(lowerTyping)) {
                const originalPrefix = suggest.substring(0, currentTypingWord.length);
                const originalSuffix = suggest.substring(currentTypingWord.length);
                item.innerHTML = `<strong>${originalPrefix}</strong>${originalSuffix}`;
            } else {
                item.innerHTML = suggest;
            }
        }
        
        item.onmousedown = (e) => {
            e.preventDefault(); 
            insertWord(suggest);
        };
        suggestionBox.appendChild(item);
    });

    // Placement based on editor caret
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

    // Wait for Monaco value update
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

        // 1. Member completion
        if (typeof getMemberCompletions === 'function' && typeof languageData !== 'undefined' && languageData[currentLanguage]?.bigrams) {
            const memberCompletions = getMemberCompletions(textBeforeCursor, languageData[currentLanguage].bigrams);
            if (memberCompletions && memberCompletions.length > 0) {
                suggestions = memberCompletions;
                isPrediction = true;
            }
        }

        // 2. Trie & fallback matching
        if (suggestions.length === 0 && currentTypingWord.length >= 1) {
            suggestions = trie.getWordsWithPrefix(currentTypingWord);
            
            if (suggestions.length < 5 && currentTypingWord.length >= 2) {
                if (typeof getSubsequenceSuggestions === 'function') {
                    const subSeqSugs = getSubsequenceSuggestions(currentTypingWord, trie.getAllWords());
                    suggestions = [...new Set([...suggestions, ...subSeqSugs])];
                }
            }
            
            if (suggestions.length === 0 && currentTypingWord.length >= 3) {
                if (typeof getFuzzySuggestions === 'function') {
                    suggestions = getFuzzySuggestions(currentTypingWord, trie.getAllWords(), 2);
                }
            }

            if (typeof processSuggestionsForSeparators === 'function') {
                suggestions = processSuggestionsForSeparators(suggestions, currentTypingWord);
            }

            if (suggestions.length > 0 && typeof rankSuggestions === 'function') {
                suggestions = rankSuggestions(suggestions, currentTypingWord, wordFrequency);
            }

            suggestions = suggestions.filter(w => w.toLowerCase() !== currentTypingWord.toLowerCase());
        }

        // 3. Space prediction
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

document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!suggestionBox || !target) return;
    const isSuggestionBox = target.id === 'lc-autosuggest-box';
    const isSuggestionItem = target.classList && target.classList.contains('lc-suggestion-item');
    if (!isSuggestionBox && !isSuggestionItem) {
        closeBox();
    }
});

createSuggestionBox();
extractWordsToTrie();
setInterval(extractWordsToTrie, 2000);
window.addEventListener('keydown', handleInput, true);