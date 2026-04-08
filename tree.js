// tree.js
const fs = require("fs");
const path = require("path");

const DEFAULT_IGNORE = new Set([
    "node_modules",
    ".git",
    ".idea",
    ".vscode",
    ".next",
    "dist",
    "build",
]);

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function isDirectory(fullPath) {
    try {
        return fs.statSync(fullPath).isDirectory();
    } catch (e) {
        return false;
    }
}

function getEntries(dirPath) {
    let entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries = entries.filter((entry) => !DEFAULT_IGNORE.has(entry.name));

    entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name, "ko");
    });

    return entries;
}

function printTree(dirPath, prefix = "") {
    const entries = getEntries(dirPath);

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const nextPrefix = prefix + (isLast ? "    " : "│   ");
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            console.log(prefix + connector + `📁 ${entry.name}`);
            printTree(fullPath, nextPrefix);
        } else {
            let sizeText = "";
            try {
                const stat = fs.statSync(fullPath);
                sizeText = ` (${formatSize(stat.size)})`;
            } catch (e) {
                sizeText = "";
            }
            console.log(prefix + connector + `📄 ${entry.name}${sizeText}`);
        }
    });
}

function main() {
    const targetDir = process.argv[2]
        ? path.resolve(process.argv[2])
        : process.cwd();

    console.log(`📂 ${path.basename(targetDir) || targetDir}`);
    printTree(targetDir);
}

main();