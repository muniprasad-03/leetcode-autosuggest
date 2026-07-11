const trie = new Trie(); 
let currentLanguage = "unknown"; 
let suggestionBox = null;
let currentTypingWord = ""; 
let currentSuggestions = [];
let selectedIndex = 0;
let lastCursorPos = { top: '150px', left: '150px' };
let wordFrequency = {};
let lastParsedCode = "";
let inputTimeout = null;
let extractTimeout = null;

window.languageData = {};
const loadedLanguages = {};

async function ensureLanguageDictionary(lang) {
    if (lang === "unknown" || loadedLanguages[lang]) return;
    
    let filename = lang;
    if (lang === "c++") filename = "cpp";
    if (lang === "python3") filename = "python";
    if (lang === "js") filename = "javascript";
    
    try {
        const url = chrome.runtime.getURL(`dictionaries/${filename}.json`);
        const response = await fetch(url);
        const data = await response.json();
        
        window.languageData[lang] = data;
        if (lang === "python") window.languageData["python3"] = data;
        if (lang === "javascript") window.languageData["js"] = data;
        
        loadedLanguages[lang] = true;
        if (lang === "python") loadedLanguages["python3"] = true;
        if (lang === "javascript") loadedLanguages["js"] = true;
        
        extractWordsToTrie();
    } catch (e) {
        console.error(`[AutoSuggest] Failed to load dictionary for ${lang}:`, e);
    }
}

function preLoadDataTypes(lang) {
    if (window.languageData && window.languageData[lang] && window.languageData[lang].keywords) {
        window.languageData[lang].keywords.forEach(type => {
            trie.insert(type);
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
    if (document.hidden) return;
    const lineElements = document.querySelectorAll('.view-line');
    if (lineElements.length === 0) return;

    const lang = getLeetCodeLanguage();
    if (lang !== currentLanguage) {
        currentLanguage = lang;
        if (lang !== "unknown" && (!window.languageData || !window.languageData[lang])) {
            ensureLanguageDictionary(lang);
        }
    }

    let codeText = "";
    lineElements.forEach(line => { codeText += line.textContent + "\n"; });

    if (codeText === lastParsedCode) return;
    lastParsedCode = codeText;

    trie.clear();
    preLoadDataTypes(currentLanguage); 
    
    wordFrequency = {};
    if (window.languageData && window.languageData[currentLanguage]?.keywords) {
        window.languageData[currentLanguage].keywords.forEach(keyword => {
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

    if (extractTimeout) clearTimeout(extractTimeout);
    extractTimeout = setTimeout(extractWordsToTrie, 1500);

    if (event.key === 'Backspace') {
        const active = document.activeElement;
        if (active && active.tagName === 'TEXTAREA') {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            if (start === end && start > 0) {
                const val = active.value;
                const charBefore = val.charAt(start - 1);
                const charAfter = val.charAt(start);
                const bracePairs = { '(': ')', '{': '}', '[': ']', '<': '>' };
                if (bracePairs[charBefore] === charAfter) {
                    // Dispatch Delete to Monaco to delete the closing brace after the cursor
                    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', code: 'Delete', keyCode: 46, bubbles: true }));
                    active.dispatchEvent(new KeyboardEvent('keyup', { key: 'Delete', code: 'Delete', keyCode: 46, bubbles: true }));
                    closeBox();
                    // Let the native Backspace event continue to delete the opening brace before the cursor
                }
            }
        }
    }

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

    // Wait for Monaco value update (with debounce optimization)
    if (inputTimeout) clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
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
        if (typeof getMemberCompletions === 'function' && window.languageData && window.languageData[currentLanguage]?.bigrams) {
            const memberCompletions = getMemberCompletions(textBeforeCursor, window.languageData[currentLanguage].bigrams);
            if (memberCompletions && memberCompletions.length > 0) {
                suggestions = memberCompletions;
                isPrediction = true;
            }
        }

        // 2. Trie & fallback matching
        if (suggestions.length === 0 && currentTypingWord.length >= 1) {
            if (window.languageData && window.languageData[currentLanguage]?.abbreviations) {
                const abbrs = window.languageData[currentLanguage].abbreviations;
                const typingLower = currentTypingWord.toLowerCase();
                for (const key in abbrs) {
                    if (key.startsWith(typingLower)) {
                        suggestions.push(abbrs[key]);
                    }
                }
            }
            
            const trieSugs = trie.getWordsWithPrefix(currentTypingWord);
            suggestions = [...new Set([...suggestions, ...trieSugs])];
            
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

            const typingLower = currentTypingWord.toLowerCase();
            suggestions = suggestions.filter(w => w.toLowerCase() !== typingLower);
        }

        // 3. Space prediction
        if (suggestions.length === 0 && currentTypingWord.length === 0) {
            if (typeof getPredictiveSuggestions === 'function' && window.languageData && window.languageData[currentLanguage]?.bigrams) {
                const predictions = getPredictiveSuggestions(textBeforeCursor, window.languageData[currentLanguage].bigrams);
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
setInterval(extractWordsToTrie, 5000);
window.addEventListener('keydown', handleInput, true);