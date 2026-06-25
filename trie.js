// ==========================================
// TRIE DATA STRUCTURE (Case-Insensitive)
// ==========================================

class TrieNode {
    constructor() { 
        this.children = {}; 
        // We use a Set to store the exact, original camelCase/PascalCase words
        // even though we navigate the tree using lowercase letters.
        this.words = new Set(); 
    }
}

class Trie {
    constructor() { 
        this.root = new TrieNode(); 
    }
    
    insert(word) {
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
    
    _findWords(node, results) {
        for (let word of node.words) {
            results.push(word);
        }
        for (let char in node.children) {
            this._findWords(node.children[char], results);
        }
    }
    
    getWordsWithPrefix(prefix) {
        let node = this.root;
        let lowerPrefix = prefix.toLowerCase(); 
        
        // Strictly matches the prefix from the starting pointer
        for (let char of lowerPrefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        
        let results = [];
        this._findWords(node, results);
        return results;
    }

    getAllWords() {
        // Used by our NLP logic to grab the entire vocabulary for fuzzy matching
        let results = [];
        this._findWords(this.root, results);
        return results;
    }
    
    clear() { 
        this.root = new TrieNode(); 
    }
}