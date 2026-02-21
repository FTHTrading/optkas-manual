#!/usr/bin/env node
/**
 * generate-audio.js
 * Placeholder for audio generation pipeline.
 * Future: integrate with ElevenLabs, Azure TTS, or Google Cloud TTS
 * to generate MP3 narrations from docs/ markdown files.
 *
 * Usage: node scripts/generate-audio.js
 * Output: audio/*.mp3
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const audioDir = path.join(__dirname, '..', 'audio');

// Ensure audio directory exists
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();

console.log('Audio Generation Pipeline');
console.log('=========================');
console.log('');
console.log('This script is a placeholder. To generate audio:');
console.log('');
console.log('1. Set your TTS API key:');
console.log('   export ELEVENLABS_API_KEY=your_key_here');
console.log('');
console.log('2. Install the TTS SDK:');
console.log('   npm install elevenlabs-node');
console.log('');
console.log('Docs found:');
files.forEach(file => {
    const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 150);
    const audioFile = file.replace('.md', '.mp3');
    const exists = fs.existsSync(path.join(audioDir, audioFile));
    console.log(`  ${file} → ${audioFile} (~${minutes} min, ${words} words) ${exists ? '✅' : '⬜'}`);
});

console.log('');
console.log('For now, use the Web Speech API (built into the web app)');
console.log('or upload MP3 files directly through the TTS panel.');
