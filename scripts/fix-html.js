import { readFileSync, writeFileSync } from 'fs';

const htmlPath = './dist/index.html';
let html = readFileSync(htmlPath, 'utf-8');

// Remove type="module" and crossorigin attributes
html = html.replace(/<script type="module" crossorigin/g, '<script defer');

writeFileSync(htmlPath, html);
console.log('Fixed index.html - removed type="module"');
