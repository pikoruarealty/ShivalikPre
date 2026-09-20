import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const wordmarkSource = "public/images/presente/brand/presented-wordmark.webp";
const background = "#f2efe8";

// Use the circular Presenté emblem, not the full horizontal wordmark. The
// wordmark becomes illegible when a browser or Google renders it at 16–48px.
const emblemCrop = await sharp(wordmarkSource)
  .extract({ left: 16, top: 46, width: 204, height: 204 })
  .png()
  .toBuffer();
const emblemMask = Buffer.from(
  '<svg width="204" height="204"><circle cx="102" cy="102" r="101" fill="white"/></svg>',
);
const emblem = await sharp(emblemCrop)
  .composite([{ input: emblemMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const renderPng = async (size, paddingRatio = 0.1) => {
  const padding = Math.max(1, Math.round(size * paddingRatio));
  const mark = await sharp(emblem)
    .resize({
      width: size - padding * 2,
      height: size - padding * 2,
      fit: "contain",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const createIco = (images) => {
  const directorySize = 6 + images.length * 16;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let imageOffset = directorySize;
  images.forEach(({ size, png }, index) => {
    const entryOffset = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(png.length, entryOffset + 8);
    header.writeUInt32LE(imageOffset, entryOffset + 12);
    imageOffset += png.length;
  });

  return Buffer.concat([header, ...images.map(({ png }) => png)]);
};

const sizes = [16, 32, 48, 180, 192, 512];
const rendered = new Map(
  await Promise.all(sizes.map(async (size) => [size, await renderPng(size)])),
);

await Promise.all([
  writeFile(
    "public/favicon.ico",
    createIco([16, 32, 48].map((size) => ({ size, png: rendered.get(size) }))),
  ),
  writeFile("public/favicon-48.png", rendered.get(48)),
  writeFile("public/apple-touch-icon.png", rendered.get(180)),
  writeFile("public/favicon-192.png", rendered.get(192)),
  writeFile("public/favicon-512.png", rendered.get(512)),
]);

console.log("Generated centered Presenté emblem favicon and app icons.");
