class TrieNode {
    constructor() { 
        this.children = {}; 
        this.words = new Set(); // Stores exact casing words
    }
}

class Trie {
    constructor() { 
        this.root = new TrieNode(); 
        this.allWordsList = []; // Caches inserted words for O(1) retrieval
        this.allWordsSet = new Set(); // O(1) duplicate checks
    }
    
    insert(word) {
        if (this.allWordsSet.has(word)) return;
        this.allWordsSet.add(word);
        this.allWordsList.push(word);

        let node = this.root;
        let lowerWord = word.toLowerCase(); 
        
        for (let char of lowerWord) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.words.add(word); 
    }
    
    _findWords(node, results, maxCount = 30) {
        if (results.length >= maxCount) return;
        for (let word of node.words) {
            results.push(word);
            if (results.length >= maxCount) return;
        }
        for (let char in node.children) {
            this._findWords(node.children[char], results, maxCount);
            if (results.length >= maxCount) return;
        }
    }
    
    getWordsWithPrefix(prefix, maxCount = 30) {
        let node = this.root;
        let lowerPrefix = prefix.toLowerCase(); 
        
        for (let char of lowerPrefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        
        let results = [];
        this._findWords(node, results, maxCount);
        return results;
    }

    getAllWords() {
        return this.allWordsList; // O(1) reference return, zero allocations
    }
    
    clear() { 
        this.root = new TrieNode(); 
        this.allWordsList = [];
        this.allWordsSet.clear();
    }
}