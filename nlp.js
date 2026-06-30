// Calculates Damerau-Levenshtein distance between string 'a' and 'b'.
function getDamerauLevenshteinDistance(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,            // insertion
                matrix[j - 1][i] + 1,            // deletion
                matrix[j - 1][i - 1] + indicator // substitution
            );
            
            // Transposition check
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

// Filters words within maxDistance, sorted by distance.
function getFuzzySuggestions(targetWord, allWords, maxDistance = 2) {
    let matches = [];
    for (let word of allWords) {
        if (Math.abs(word.length - targetWord.length) > maxDistance) continue;
        
        let dist = getDamerauLevenshteinDistance(targetWord, word);
        if (dist <= maxDistance) {
            matches.push({ word, dist });
        }
    }
    matches.sort((a, b) => a.dist - b.dist || a.word.localeCompare(b.word));
    return matches.map(m => m.word);
}

// Scores subsequence match; favors starts, CamelCase boundaries, and consecutive chars.
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
            
            if (wIdx === 0) {
                weight += 12; // word start bonus
            } else if (word[wIdx] !== wordLower[wIdx]) {
                weight += 10; // camelCase boundary
            } else if (wIdx > 0 && !/[a-zA-Z0-9]/.test(word[wIdx - 1])) {
                weight += 10; // non-alphanumeric separator boundary
            }
            
            if (lastMatchedIdx !== -1 && wIdx === lastMatchedIdx + 1) {
                weight += 6; // consecutive match bonus
            }
            
            score += weight;
            lastMatchedIdx = wIdx;
            pIdx++;
        }
        wIdx++;
    }
    
    if (pIdx === pattern.length) {
        score -= (word.length - pattern.length) * 0.15; // length penalty
        return score;
    }
    return null;
}

// Returns subsequence matches sorted by score.
function getSubsequenceSuggestions(targetWord, allWords) {
    let matches = [];
    for (let word of allWords) {
        const score = scoreSubsequence(targetWord, word);
        if (score !== null) {
            matches.push({ word, score });
        }
    }
    matches.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    return matches.map(m => m.word);
}

// Truncates class/namespace member suggestions to their parent class if typingWord has no separator.
function processSuggestionsForSeparators(suggestions, typingWord) {
    const hasSeparator = typingWord.includes(".") || typingWord.includes("::");
    if (hasSeparator) return suggestions;

    const processed = suggestions.map(word => {
        const dotIndex = word.indexOf(".");
        if (dotIndex !== -1) return word.substring(0, dotIndex + 1);
        
        const nsIndex = word.indexOf("::");
        if (nsIndex !== -1) return word.substring(0, nsIndex + 2);
        
        return word;
    });
    return [...new Set(processed)];
}

// Ranks suggestions based on match strength and document term frequency.
function rankSuggestions(suggestions, typingWord, wordFrequency = {}) {
    const typingLower = typingWord.toLowerCase();
    
    const scored = suggestions.map(word => {
        const wordLower = word.toLowerCase();
        let matchScore = 0;
        
        if (wordLower.startsWith(typingLower)) {
            matchScore = 120 + (typingWord.length / word.length) * 15;
        } else {
            const subScore = scoreSubsequence(typingWord, word);
            if (subScore !== null) {
                matchScore = 60 + subScore;
            } else {
                const dist = getDamerauLevenshteinDistance(typingWord, word);
                matchScore = 10 + (3 - dist) * 10;
            }
        }
        
        const tf = wordFrequency[word] || 0;
        const tfBoost = Math.min(tf * 3, 25);
        
        return { word, score: matchScore + tfBoost };
    });
    
    scored.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    return scored.map(item => item.word);
}

// Returns member suggestions (e.g. object.member or namespace::member).
function getMemberCompletions(textBeforeCursor, bigramsDictionary) {
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

// Predicts next word from bigrams/trigrams dictionary (Markov Chain N-gram).
function getPredictiveSuggestions(textBeforeCursor, bigramsDictionary) {
    if (!textBeforeCursor.endsWith(" ")) return [];

    const words = textBeforeCursor.trim().split(/\s+/);
    if (words.length === 0) return [];
    
    // Try Trigram (last two words)
    if (words.length >= 2) {
        const lastTwo = (words[words.length - 2] + " " + words[words.length - 1]).toLowerCase();
        if (bigramsDictionary[lastTwo]) {
            return bigramsDictionary[lastTwo];
        }
    }
    
    // Fallback to Bigram (last single word)
    const lastWord = words[words.length - 1].toLowerCase();
    return bigramsDictionary[lastWord] || [];
}