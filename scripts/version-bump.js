#!/usr/bin/env node
/**
 * version-bump.js
 * Semantic version bumper for package.json
 * Usage: node scripts/version-bump.js [patch|minor|major]
 * Default: patch
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const bumpType = process.argv[2] || 'patch';
const parts = pkg.version.split('.').map(Number);

switch (bumpType) {
    case 'major':
        parts[0]++;
        parts[1] = 0;
        parts[2] = 0;
        break;
    case 'minor':
        parts[1]++;
        parts[2] = 0;
        break;
    case 'patch':
    default:
        parts[2]++;
        break;
}

const oldVersion = pkg.version;
pkg.version = parts.join('.');

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Version bumped: ${oldVersion} → ${pkg.version}`);
