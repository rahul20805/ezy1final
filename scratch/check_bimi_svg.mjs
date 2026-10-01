import fs from 'fs';

const svg = fs.readFileSync('src/frontend/public/ezy1-bimi.svg', 'utf-8');
console.log('--- Checking src/frontend/public/ezy1-bimi.svg ---');
console.log('Has version 1.2:', svg.includes('version="1.2"'));
console.log('Has baseProfile tiny-ps:', svg.includes('baseProfile="tiny-ps"'));
console.log('Has filter tag:', svg.includes('<filter'));
console.log('Has feDropShadow tag:', svg.includes('feDropShadow'));
console.log('Has unsupported CSS filter:', svg.includes('filter='));
console.log('File size:', svg.length, 'bytes');
