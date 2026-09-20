import path from "node:path";
import sharp from "sharp";

const assets = [
  "public/images/presente/landscape/podium-garden.png",
  "public/images/presente/amenities/private-wellness-pool.png",
  "public/images/presente/architecture/three-expressions.png",
  "public/images/presente/amenities/social-dining-lounge.png",
  "public/images/presente/interiors/private-arrival-gallery.png",
  "public/images/presente/amenities/private-cinema-games.png",
  "public/images/presente/interiors/private-lift-foyer.png",
  "public/images/presente/location/gift-city-skyline.jpeg",
  "public/images/presente/brand/presented-wordmark.png",
];

for (const asset of assets) {
  const parsed = path.parse(asset);
  const output = path.join(parsed.dir, `${parsed.name}.webp`);
  await sharp(asset).webp({ quality: 82, effort: 6 }).toFile(output);
  console.log(`${asset} -> ${output}`);
}
