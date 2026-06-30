class TrieNode {
    constructor() { 
        this.children = {}; 
        this.words = new Set(); // Stores exact casing words
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
        
        for (let char of lowerPrefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        
        let results = [];
        this._findWords(node, results);
        return results;
    }

    getAllWords() {
        let results = [];
        this._findWords(this.root, results);
        return results;
    }
    
    clear() { 
        this.root = new TrieNode(); 
    }
}