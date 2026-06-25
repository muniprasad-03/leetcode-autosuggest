// ==========================================
// AGENTIC AI: LOCAL LLM (Gemini Nano)
// ==========================================

// Global state to prevent the extension from spamming the LLM 
// or the console every time the user types a key.
let hasAiScannedProblem = false;

/**
 * Reads the LeetCode problem description from the DOM and prompts Chrome's
 * local Gemini Nano model to predict highly relevant variable names.
 * @param {Trie} targetTrie - The global Trie instance to inject words into.
 */
async function analyzeProblemWithLocalLLM(targetTrie) {
    // 1. Prevent duplicate scans or endless failure loops
    if (hasAiScannedProblem) return;

    // 2. Check if the user has Chrome's experimental AI features enabled
    if (!window.ai || !window.ai.languageModel) {
        console.log("🤖 Local LLM not enabled in Chrome flags. Skipping agentic extraction.");
        // THE FIX: Set this to true so it doesn't spam the console every 2 seconds
        hasAiScannedProblem = true; 
        return;
    }

    try {
        // 3. Extract the problem description
        const metaTag = document.querySelector('meta[property="og:description"]');
        if (!metaTag || !metaTag.content) {
            console.log("🤖 Could not find problem description. Skipping AI scan.");
            hasAiScannedProblem = true; // Prevent spam if description is missing
            return;
        }
        
        const problemDescription = metaTag.content;
        console.log("🤖 Local LLM Agent: Analyzing problem...");

        // 4. Create the specialized Prompt Session
        const session = await window.ai.languageModel.create({
            systemPrompt: "You are an expert competitive programming assistant. Read the algorithmic problem description and output ONLY a comma-separated list of 5 to 10 variable names that would be standard and highly useful for writing this algorithm in Java (e.g., dp, adjList, visited, low, high, mid). Do not include any other text."
        });

        // 5. Prompt the model (truncating to 1500 chars to save local memory)
        const response = await session.prompt(problemDescription.substring(0, 1500));
        
        // 6. Clean the LLM output and inject into the Trie
        const variables = response.split(',').map(v => v.trim().replace(/[^a-zA-Z_]/g, ''));
        
        variables.forEach(v => {
            if (v.length > 2) {
                targetTrie.insert(v);
            }
        });

        console.log("🔥 Agentic AI injected predictive variables into dictionary:", variables);
        
        // Mark as successful so it doesn't run again on this page load
        hasAiScannedProblem = true; 
        
    } catch (error) {
        console.error("🤖 Local LLM Agent Error:", error);
        hasAiScannedProblem = true; // Prevent spam if the LLM crashes
    }
}