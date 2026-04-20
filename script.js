function analyzeCode() {
    const code = document.getElementById("codeInput").value;
    const lines = code.split('\n');

    let maxDepth = 0;
    let currentDepth = 0;
    let pendingLoop = false; // for loops without {}

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Detect loop
        if (line.startsWith("for") || line.startsWith("while")) {
            // Check if it has {
            if (line.includes("{")) {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else {
                // no { → then next line is body
                pendingLoop = true;
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            }
        }

        // Handling pending loop (single-line body)
        else if (pendingLoop) {
            pendingLoop = false;
            currentDepth--; 
        }

        // Handle block closing
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
        reason = "Single loop or sequential loops";
    } else {
        complexity = `O(n^${maxDepth})`;
        reason = `${maxDepth} nested loops detected`;
    }

    document.getElementById("complexity").innerText = complexity;
    document.getElementById("reason").innerText = reason;
}