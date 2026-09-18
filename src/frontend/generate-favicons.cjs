const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

// 1. Generate favicon.svg (512x512)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6A00" />
      <stop offset="50%" stop-color="#FF5100" />
      <stop offset="100%" stop-color="#E53935" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF500" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#B71C1C" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background rounded squircle -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#bgGrad)" filter="url(#shadow)" />
  
  <!-- Subtle border highlight -->
  <rect x="25" y="25" width="462" height="462" rx="111" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4" />
  
  <!-- Gloss overlay -->
  <path d="M 24 136 C 24 74, 74 24, 136 24 L 376 24 C 438 24, 488 74, 488 136 L 488 220 C 360 250, 160 210, 24 250 Z" fill="url(#glossGrad)" />

  <!-- Brand Text: ezy1 -->
  <!-- "ezy" in crisp white, "1" in glowing gold -->
  <g id="brand-text">
    <text x="256" y="295" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" 
          font-weight="900" 
          font-size="160" 
          letter-spacing="-3">
      <tspan fill="#FFFFFF">ezy</tspan><tspan fill="url(#goldGrad)" font-size="180">1</tspan>
    </text>
  </g>

  <!-- Speed accent pill / underline under ezy1 -->
  <rect x="140" y="338" width="180" height="18" rx="9" fill="url(#goldGrad)" />
  <circle cx="116" cy="347" r="9" fill="#FFFFFF" />
  <circle cx="346" cy="347" r="9" fill="url(#goldGrad)" />
  <circle cx="376" cy="347" r="6" fill="#FFFFFF" opacity="0.85" />

  <!-- Dynamic spark above the "1" -->
  <path d="M 408 140 L 415 160 L 435 167 L 415 174 L 408 194 L 401 174 L 381 167 L 401 160 Z" fill="url(#goldGrad)" />
</svg>`;

// 2. Full Horizontal Logo SVG
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <defs>
    <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6A00" />
      <stop offset="50%" stop-color="#FF5100" />
      <stop offset="100%" stop-color="#E53935" />
    </linearGradient>
    <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF500" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="logoGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Left Icon Emblem -->
  <g transform="translate(4, 8)">
    <rect x="0" y="0" width="64" height="64" rx="18" fill="url(#logoBgGrad)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="17.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
    
    <text x="32" y="42" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-weight="900" 
          font-size="25" 
          letter-spacing="-1">
      <tspan fill="#FFFFFF">ezy</tspan><tspan fill="url(#logoGoldGrad)" font-size="28">1</tspan>
    </text>
    
    <rect x="18" y="48" width="22" height="3" rx="1.5" fill="url(#logoGoldGrad)" />
    <circle cx="14" cy="49.5" r="1.5" fill="#FFFFFF" />
    <circle cx="44" cy="49.5" r="1.5" fill="url(#logoGoldGrad)" />
  </g>

  <!-- Right Typography -->
  <g transform="translate(80, 0)">
    <text x="0" y="47" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-weight="900" 
          font-size="44" 
          letter-spacing="-1.5">
      <tspan fill="currentColor">ezy</tspan><tspan fill="#FF5722">1</tspan>
    </text>
    <text x="2" y="65" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-weight="700" 
          font-size="10.5" 
          letter-spacing="2.8" 
          fill="#FF6A00">
      SUPERAPP &bull; HYPERLOCAL
    </text>
  </g>
</svg>`;

async function run() {
  // Write SVG files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'ezy1-logo.svg'), faviconSvg, 'utf8');
  console.log('Wrote favicon.svg and logo.svg');

  // Convert SVG to PNG buffers
  const svgBuffer = Buffer.from(faviconSvg);

  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

  // Generate 1200x630 og-image.png
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
      <linearGradient id="ogLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF7A00" />
        <stop offset="50%" stop-color="#FF5100" />
        <stop offset="100%" stop-color="#E52E00" />
      </linearGradient>
      <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF275" />
        <stop offset="100%" stop-color="#FFB300" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#ogBg)" />
    
    <!-- Ambient glow circle -->
    <circle cx="600" cy="300" r="280" fill="#FF5100" opacity="0.12" />
    
    <!-- Centered Logo Badge -->
    <g transform="translate(480, 110)">
      <rect x="0" y="0" width="240" height="240" rx="60" fill="url(#ogLogoGrad)" />
      <rect x="2" y="2" width="236" height="236" rx="58" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4" />
      <text x="120" y="145" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" fontSize="88" letter-spacing="-3">
        <tspan fill="#FFFFFF">ezy</tspan><tspan fill="url(#ogGold)" font-size="96">1</tspan>
      </text>
      <rect x="68" y="168" width="90" height="10" rx="5" fill="url(#ogGold)" />
      <circle cx="56" cy="173" r="5" fill="#FFFFFF" />
      <circle cx="172" cy="173" r="5" fill="url(#ogGold)" />
    </g>

    <!-- Headline and Tagline -->
    <text x="600" y="420" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="64" letter-spacing="-1">
      <tspan fill="#FFFFFF">ezy</tspan><tspan fill="#FF5100">1</tspan>
    </text>
    <text x="600" y="475" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="24" fill="#94A3B8" letter-spacing="1">
      Everything You Need, One Platform &#8226; Hyperlocal SuperApp
    </text>
  </svg>`;
  const ogBuffer = await sharp(Buffer.from(ogSvg)).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);
  console.log('Wrote og-image.png');
  console.log('Wrote all PNG favicons');

  // Build standard multi-resolution ICO file from png16, png32, png48
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + (images.length * 16);
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.buffer)
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Wrote valid favicon.ico (${icoBuffer.length} bytes)`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
