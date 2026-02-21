#!/usr/bin/env node
/**
 * build-search-index.js
 * Generates a JSON search index from docs/ markdown files.
 * Usage: node scripts/build-search-index.js
 * Output: public/search-index.json
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const outputPath = path.join(__dirname, '..', 'public', 'search-index.json');

function extractEntries(filePath, filename) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const entries = [];

    // Extract section from filename
    const match = filename.match(/^(\d+)-(.+)\.md$/);
    const section = match ? match[2].replace(/-/g, ' ') : filename;

    // Extract table rows (capability registers)
    const tableRowRegex = /\|\s*([A-Z][\w.-]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let tableMatch;
    while ((tableMatch = tableRowRegex.exec(content)) !== null) {
        const id = tableMatch[1].trim();
        if (id === 'ID' || id.startsWith('---')) continue;
        entries.push({
            id: id,
            name: tableMatch[2].trim(),
            detail: tableMatch[3].trim(),
            status: tableMatch[4].trim(),
            source: filename,
            section: section
        });
    }

    // Extract headings
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let headingMatch;
    while ((headingMatch = headingRegex.exec(content)) !== null) {
        entries.push({
            id: '',
            name: headingMatch[2].trim(),
            detail: 'Heading (H' + headingMatch[1].length + ')',
            status: '',
            source: filename,
            section: section
        });
    }

    return entries;
}

// Main
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();
let allEntries = [];

files.forEach(file => {
    const filePath = path.join(docsDir, file);
    const entries = extractEntries(filePath, file);
    allEntries = allEntries.concat(entries);
});

fs.writeFileSync(outputPath, JSON.stringify(allEntries, null, 2));
console.log(`Search index generated: ${allEntries.length} entries → ${outputPath}`);
