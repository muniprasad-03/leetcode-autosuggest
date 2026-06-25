// ==========================================
// 1. FUZZY MATCHING (Levenshtein Distance)
// ==========================================

/**
 * Calculates the exact number of edits (insertions, deletions, substitutions) 
 * required to turn string 'a' into string 'b'.
 */
function getEditDistance(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    
    // Quick exit if one string is empty
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    // Initialize the 2D matrix
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    // Populate the matrix
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,            // insertion
                matrix[j - 1][i] + 1,            // deletion
                matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return matrix[b.length][a.length];
}

/**
 * Filters a massive array of words down to the ones that are closest 
 * to the user's typo, sorted by relevance.
 */
function getFuzzySuggestions(targetWord, allWords, maxDistance = 2) {
    let matches = [];
    
    for (let word of allWords) {
        // Optimization: Skip words that are mathematically impossible to match 
        // within the maxDistance based on length alone.
        if (Math.abs(word.length - targetWord.length) > maxDistance) continue;
        
        let dist = getEditDistance(targetWord, word);
        if (dist <= maxDistance) {
            matches.push({ word, dist });
        }
    }
    
    // Sort by closest distance first. If distances are tied, sort alphabetically.
    matches.sort((a, b) => a.dist - b.dist || a.word.localeCompare(b.word));
    
    // Map back to a simple array of strings
    return matches.map(m => m.word);
}

// ==========================================
// 2. N-GRAM PREDICTION PROCESSOR
// ==========================================

/**
 * Parses the current line of text to determine if an N-Gram prediction 
 * should be triggered based on the previous word.
 */
function getPredictiveSuggestions(textBeforeCursor, bigramsDictionary) {
    // Only trigger predictions if the user just pressed the spacebar
    if (!textBeforeCursor.endsWith(" ")) {
        return [];
    }

    // Extract the very last word typed
    const words = textBeforeCursor.trim().split(/\s+/);
    if (words.length === 0) return [];
    
    const lastWord = words[words.length - 1].toLowerCase();
    
    // Look it up in the dictionary.js bigrams map
    if (bigramsDictionary[lastWord]) {
        return bigramsDictionary[lastWord];
    }
    
    return [];
}