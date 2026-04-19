function analyzeCode() {
    const code = document.getElementById("codeInput").value;

    // Normalize code (remove extra spaces)
    const lines = code.split('\n');

    let maxDepth = 0;
    let currentDepth = 0;

    for (let line of lines) {
        line = line.trim();

        // Detect loop
        if (line.startsWith("for") || line.startsWith("while")) {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
        }

        // Detect block closing
        if (line.includes("}")) {
            if (currentDepth > 0) currentDepth--;
        }
    }

    let complexity = "";
    let reason = "";

    if (maxDepth === 0) {
        complexity = "O(1)";
        reason = "No loops detected";
    } else if (maxDepth === 1) {
        complexity = "O(n)";
        reason = "1 loop detected";
    } else {
        complexity = `O(n^${maxDepth})`;
        reason = `${maxDepth} nested loops detected`;
    }

    document.getElementById("complexity").innerText = complexity;
    document.getElementById("reason").innerText = reason;
}