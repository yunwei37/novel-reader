const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawBookIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Calculate proportions
    const padding = size * 0.15;
    const bookWidth = size - (padding * 2);
    const bookHeight = (size - (padding * 2)) * 0.8;

    // Draw book cover
    ctx.fillStyle = '#4a90e2';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding + bookWidth, padding);
    ctx.lineTo(padding + bookWidth, padding + bookHeight);
    ctx.lineTo(padding, padding + bookHeight);
    ctx.closePath();
    ctx.fill();

    // Draw book spine effect
    ctx.fillStyle = '#357abd';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding + (size * 0.1), padding + (size * 0.05));
    ctx.lineTo(padding + (size * 0.1), padding + bookHeight + (size * 0.05));
    ctx.lineTo(padding, padding + bookHeight);
    ctx.closePath();
    ctx.fill();

    // Draw some lines to represent pages
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.02;
    const lineGap = bookHeight / 4;
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(padding + (size * 0.2), padding + (lineGap * i));
        ctx.lineTo(padding + bookWidth - (size * 0.1), padding + (lineGap * i));
        ctx.stroke();
    }

    return canvas;
}

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
[192, 512].forEach(size => {
    const canvas = drawBookIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
    console.log(`Generated ${size}x${size} icon`);
}); 