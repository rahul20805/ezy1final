import fs from "fs";
import path from "path";

const ecosystemFilePath = path.resolve("src/frontend/src/ecosystem-data.ts");
const mockDataFilePath = path.resolve("src/frontend/src/mock-data.ts");
const publicDir = path.resolve("src/frontend/public");

const contentEcosystem = fs.readFileSync(ecosystemFilePath, "utf8");
const contentMock = fs.readFileSync(mockDataFilePath, "utf8");

// Extract all image URLs
const urlRegex = /https:\/\/images\.unsplash\.com\/[^\s"',]+/g;
const urls = new Set([
  ...(contentEcosystem.match(urlRegex) || []),
  ...(contentMock.match(urlRegex) || [])
]);

console.log(`Found ${urls.size} unique image URLs across ecosystem & mock data.`);

// Check local public assets
const publicFiles = fs.readdirSync(publicDir);
console.log(`Public directory contains ${publicFiles.length} files/dirs.`);

// Verify 10 images with HTTP HEAD
let passed = 0;
let failed = 0;
for (const url of Array.from(urls).slice(0, 10)) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) passed++;
    else failed++;
  } catch {
    failed++;
  }
}
console.log(`Verified sample images: ${passed} passed, ${failed} failed.`);
process.exit(0);
