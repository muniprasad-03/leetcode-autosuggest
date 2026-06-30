// ==========================================
// 1. FUZZY MATCHING (Damerau-Levenshtein Distance)
// ==========================================

/**
 * Calculates the Damerau-Levenshtein distance between string 'a' and string 'b'.
 * This accounts for insertions, deletions, substitutions, and transposition of 
 * adjacent characters (e.g., swapping 'e' and 'h' in 'teh' to get 'the').
 */
function getDamerauLevenshteinDistance(a, b) {
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
            
            // Transposition check: check if two adjacent characters are swapped
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                matrix[j][i] = Math.min(
                    matrix[j][i],
                    matrix[j - 2][i - 2] + indicator // transposition
                );
            }
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
        
        let dist = getDamerauLevenshteinDistance(targetWord, word);
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
// 2. SUBSEQUENCE & ABBREVIATION MATCHING
// ==========================================

/**
 * Computes a similarity score for a subsequence pattern match.
 * Favoring CamelCase boundaries, word starts, and consecutive matching characters.
 * Returns a score if it matches, or null if it's not a subsequence.
 */
function scoreSubsequence(pattern, word) {
    if (pattern.length === 0) return 0;
    
    let pIdx = 0;
    let wIdx = 0;
    let score = 0;
    let lastMatchedIdx = -1;
    
    const patternLower = pattern.toLowerCase();
    const wordLower = word.toLowerCase();
    
    while (wIdx < word.length && pIdx < pattern.length) {
        if (wordLower[wIdx] === patternLower[pIdx]) {
            let weight = 1;
            
            // 1. High bonus for starting character of the word
            if (wIdx === 0) {
                weight += 12;
            }
            // 2. High bonus for camelCase boundary (e.g. 'M' in 'HashMap')
            else if (word[wIdx] !== wordLower[wIdx]) {
                weight += 10;
            }
            // 3. High bonus for matching after an underscore, dot, or bracket
            else if (wIdx > 0 && !/[a-zA-Z0-9]/.test(word[wIdx - 1])) {
                weight += 10;
            }
            // 4. Bonus for consecutive matches
            if (lastMatchedIdx !== -1 && wIdx === lastMatchedIdx + 1) {
                weight += 6;
            }
            
            score += weight;
            lastMatchedIdx = wIdx;
            pIdx++;
        }
        wIdx++;
    }
    
    // If the entire pattern is matched as a subsequence, return the score
    if (pIdx === pattern.length) {
        // Minor penalty for extra letters in the word to rank shorter/exact matches higher
        score -= (word.length - pattern.length) * 0.15;
        return score;
    }
    
    return null;
}

/**
 * Filters and scores a list of words using the subsequence matcher.
 */
function getSubsequenceSuggestions(targetWord, allWords) {
    let matches = [];
    
    for (let word of allWords) {
        const score = scoreSubsequence(targetWord, word);
        if (score !== null) {
            matches.push({ word, score });
        }
    }
    
    // Sort descending by score, then alphabetically
    matches.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    return matches.map(m => m.word);
}

// ==========================================
// 3. UNIFIED RANKING SYSTEM
// ==========================================

/**
 * Scores and ranks suggestions based on match strength and term frequency.
 */
function rankSuggestions(suggestions, typingWord, wordFrequency = {}) {
    const typingLower = typingWord.toLowerCase();
    
    const scored = suggestions.map(word => {
        const wordLower = word.toLowerCase();
        let matchScore = 0;
        let type = 'other';
        
        // Tier 1: Prefix / Exact match
        if (wordLower.startsWith(typingLower)) {
            type = 'prefix';
            matchScore = 120 + (typingWord.length / word.length) * 15;
        } 
        // Tier 2: Subsequence match
        else {
            const subScore = scoreSubsequence(typingWord, word);
            if (subScore !== null) {
                type = 'subsequence';
                matchScore = 60 + subScore;
            } 
            // Tier 3: Fuzzy match fallback
            else {
                const dist = getDamerauLevenshteinDistance(typingWord, word);
                type = 'fuzzy';
                // Higher score for smaller distance
                matchScore = 10 + (3 - dist) * 10;
            }
        }
        
        // Term Frequency (TF) boost: prioritizes variables/methods used frequently in the active code
        const tf = wordFrequency[word] || 0;
        const tfBoost = Math.min(tf * 3, 25); // Cap the TF boost so it doesn't break the tiers
        
        return {
            word,
            score: matchScore + tfBoost,
            type
        };
    });
    
    scored.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    return scored.map(item => item.word);
}

// ==========================================
// 4. PREDICTIVE & MEMBER COMPLETIONS
// ==========================================

/**
 * Checks if the user is typing a member access (e.g., 'Arrays.s' or 'std::v')
 * and returns matching completions from the bigrams dictionary.
 */
function getMemberCompletions(textBeforeCursor, bigramsDictionary) {
    // Match patterns like 'object.prefix' or 'namespace::prefix'
    const memberRegex = /([a-zA-Z0-9_]+)(\.|\:\:)([a-zA-Z0-9_]*)$/;
    const match = textBeforeCursor.match(memberRegex);
    if (!match) return null;

    const objName = match[1].toLowerCase();
    const separator = match[2];
    const prefix = match[3].toLowerCase();
    
    const lookupKey = objName + separator;
    const completions = bigramsDictionary[lookupKey];
    
    if (completions) {
        if (prefix === "") return completions;
        return completions.filter(item => item.toLowerCase().startsWith(prefix));
    }
    
    return null;
}

/**
 * Parses the current line of text to determine if a space-based 
 * N-Gram prediction should be triggered.
 */
function getPredictiveSuggestions(textBeforeCursor, bigramsDictionary) {
    // Only trigger space predictions if the user just pressed the spacebar
    if (!textBeforeCursor.endsWith(" ")) {
        return [];
    }

    const words = textBeforeCursor.trim().split(/\s+/);
    if (words.length === 0) return [];
    
    const lastWord = words[words.length - 1].toLowerCase();
    
    if (bigramsDictionary[lastWord]) {
        return bigramsDictionary[lastWord];
    }
    
    return [];
}