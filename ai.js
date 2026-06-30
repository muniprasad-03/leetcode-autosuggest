let hasAiScannedProblem = false;

// Uses local Chrome Gemini Nano model to predict relevant variable names from description
async function analyzeProblemWithLocalLLM(targetTrie) {
    if (hasAiScannedProblem) return;

    if (!window.ai || !window.ai.languageModel) {
        console.log("🤖 Local LLM not enabled. Skipping agentic extraction.");
        hasAiScannedProblem = true; 
        return;
    }

    try {
        const metaTag = document.querySelector('meta[property="og:description"]');
        if (!metaTag || !metaTag.content) {
            hasAiScannedProblem = true;
            return;
        }
        
        const problemDescription = metaTag.content;
        const session = await window.ai.languageModel.create({
            systemPrompt: "You are an expert competitive programming assistant. Read the algorithmic problem description and output ONLY a comma-separated list of 5 to 10 variable names that would be standard and highly useful for writing this algorithm in Java (e.g., dp, adjList, visited, low, high, mid). Do not include any other text."
        });

        const response = await session.prompt(problemDescription.substring(0, 1500));
        const variables = response.split(',').map(v => v.trim().replace(/[^a-zA-Z_]/g, ''));
        
        variables.forEach(v => {
            if (v.length > 2) {
                targetTrie.insert(v);
            }
        });
        hasAiScannedProblem = true; 
    } catch (error) {
        console.error("🤖 Local LLM Agent Error:", error);
        hasAiScannedProblem = true;
    }
}