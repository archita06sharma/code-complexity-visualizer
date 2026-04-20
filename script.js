function analyzeCode() {
    const code = document.getElementById("codeInput").value;
    const lines = code.split('\n');

    let linearCount = 0;
    let logCount = 0;

    const forRegex = /^for\s*\((.*)\)/;
    const whileRegex = /^while\s*\((.*)\)/;

    let validLoop = false;

    for (let line of lines) {
        line = line.trim();
        if (line === "") continue;

        let forMatch = line.match(forRegex);
        let whileMatch = line.match(whileRegex);

        // FOR LOOP ANALYSIS
        if (forMatch) {
            validLoop = true;

            let inside = forMatch[1]; // content inside ()
            let parts = inside.split(";");

            if (parts.length === 3) {
                let update = parts[2];

                if (update.includes("++") || update.includes("+=")) {
                    linearCount++;
                }
                else if (update.includes("*=") || update.includes("/=")) {
                    logCount++;
                }
            }
        }

        // WHILE LOOP ANALYSIS (basic)
        else if (whileMatch) {
            validLoop = true;

            // crude detection
            if (line.includes("/=") || line.includes("*=")) {
                logCount++;
            } else {
                linearCount++;
            }
        }
    }

    if (!validLoop) {
        document.getElementById("complexity").innerText = "Invalid Code";
        document.getElementById("reason").innerText = "No valid loops detected";
        return;
    }

    // BUILD COMPLEXITY STRING
    let complexity = "O(";

    if (linearCount > 0) {
        complexity += linearCount === 1 ? "n" : `n^${linearCount}`;
    }

    if (logCount > 0) {
        if (linearCount > 0) complexity += " ";
        complexity += logCount === 1 ? "log n" : `(log n)^${logCount}`;
    }

    complexity += ")";

    let reason = `${linearCount} linear loop(s), ${logCount} logarithmic loop(s)`;

    document.getElementById("complexity").innerText = complexity;
    document.getElementById("reason").innerText = reason;
}