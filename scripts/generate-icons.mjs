import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const logoSource = "public/images/brand/shivalik-logo-favicon-source.png";

const trimmedLogo = await sharp(logoSource)
  .flatten({ background: "#ffffff" })
  .trim({ background: "#ffffff", threshold: 12 })
  .png()
  .toBuffer();

const renderPng = async (size) => {
  const padding = Math.max(2, Math.round(size * 0.035));
  const mark = await sharp(trimmedLogo)
    .resize({
      width: size - padding * 2,
      height: size - padding * 2,
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const createIco = (png) => {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(48, 6);
  header.writeUInt8(48, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, png]);
};

const [faviconPng, appleIcon, largeIcon] = await Promise.all([
  renderPng(48),
  renderPng(180),
  renderPng(512),
]);

await Promise.all([
  writeFile("public/favicon.ico", createIco(faviconPng)),
  writeFile("public/apple-touch-icon.png", appleIcon),
  writeFile("public/favicon-512.png", largeIcon),
]);

console.log("Generated Shivalik Présenté favicon and app icons.");
