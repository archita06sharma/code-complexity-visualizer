function analyzeCode() {
    const code = document.getElementById("codeInput").value;
    const lines = code.split('\n');

    let maxDepth = 0;
    let currentDepth = 0;
    let pendingLoop = false;

    let validLoopCount = 0;
    let invalidLines = 0;

    let hasLogPattern = false;

    // Regex for valid loops
    const forRegex = /^for\s*\(.*\)/;
    const whileRegex = /^while\s*\(.*\)/;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line === "") continue;

        let isFor = forRegex.test(line);
        let isWhile = whileRegex.test(line);

        if(line.include("/=") || line includes("/ 2")){
            hasLogPattern = true;
        }

        if (isFor || isWhile) {
            validLoopCount++;

            if (line.includes("{")) {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else {
                pendingLoop = true;
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            }
        }
        else if (line.startsWith("for") || line.startsWith("while")) {
            // Looks like loop but invalid
            invalidLines++;
        }

        // Handle one-line loop body
        else if (pendingLoop) {
            pendingLoop = false;
            currentDepth--;
        }

        // Handle block closing
        if (line.includes("}")) {
            if (currentDepth > 0) currentDepth--;
        }
    }

    // VALIDATION CHECK
    if (validLoopCount === 0 || invalidLines > validLoopCount) {
        document.getElementById("complexity").innerText = "Invalid Code";
        document.getElementById("reason").innerText = "Unsupported or incorrect syntax";
        return;
    }

    // FINAL OUTPUT
    let complexity = "";
    let reason = "";

    if (hasLogPattern && maxDepth === 0) {
        complexity = "O(log n)";
        reason = "Logarithmic reduction detected";
    }
    else if (hasLogPattern && maxDepth > 0) {
        complexity = `O(n^${maxDepth} log n)`;
        reason = "Loop with logarithmic inner operation";
    }
    else if (maxDepth === 0) {
        complexity = "O(1)";
        reason = "No loops detected";
    }
    else if (maxDepth === 1) {
        complexity = "O(n)";
        reason = "Single loop detected";
    }
    else {
        complexity = `O(n^${maxDepth})`;
        reason = `${maxDepth} nested loops detected`;
    }

    document.getElementById("complexity").innerText = complexity;
    document.getElementById("reason").innerText = reason;
}