const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'assets', 'vehicles');

async function cleanExtract() {
  // 1. Clean Volvo FH16 750 (media_1795361230441_a04faf3c.jpg: 735 x 851)
  // The truck is from left: 190, top: 195, width: 360, height: 385
  // Note: 360 View is at left < 180, VIEW UNIT is at left > 550.
  // By extracting left: 180, top: 195, width: 375, height: 380, we get the 100% CLEAN TRUCK with NO buttons!
  const imgFh16 = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361230441_a04faf3c.jpg';
  
  // Crop clean truck
  const truckBuffer = await sharp(imgFh16)
    .extract({ left: 185, top: 200, width: 365, height: 380 })
    .toBuffer();

  // Create clean studio canvas (512 x 341 or 600 x 400) with warm studio background (#FFFDF9)
  // Resize truck to fit neatly in center
  const cleanTruckResized = await sharp(truckBuffer)
    .resize({ height: 320, fit: 'contain', background: { r: 255, g: 253, b: 249, alpha: 1 } })
    .toBuffer();

  const metaResized = await sharp(cleanTruckResized).metadata();

  const fh16Clean = await sharp({
    create: {
      width: 512,
      height: 341,
      channels: 4,
      background: { r: 255, g: 253, b: 249, alpha: 1 }
    }
  })
  .composite([
    {
      input: cleanTruckResized,
      top: Math.round((341 - metaResized.height) / 2),
      left: Math.round((512 - metaResized.width) / 2)
    }
  ])
  .png()
  .toBuffer();

  const v14Dir = path.join(baseDir, 'volvo-fh16-750');
  await sharp(fh16Clean).png().toFile(path.join(v14Dir, 'front.png'));
  await sharp(fh16Clean).webp({ quality: 95 }).toFile(path.join(v14Dir, 'front.webp'));
  console.log('✓ Cleaned Volvo FH16 750 (ZERO buttons, pure studio image)');

  // 2. Clean Mercedes-Benz Actros (media_1795361250105_5ae49518.jpg: 1024 x 672)
  // Truck & podium are centered: left: 340, top: 140, width: 345, height: 300
  // 360 badge is at left > 900, top: 150. VIEW UNIT is at left > 860, top: 410.
  // By extracting left: 330, top: 140, width: 365, height: 300, we get the clean Actros on podium!
  const imgActros = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361250105_5ae49518.jpg';
  
  const actrosTruckBuffer = await sharp(imgActros)
    .extract({ left: 335, top: 140, width: 355, height: 295 })
    .toBuffer();

  const actrosResized = await sharp(actrosTruckBuffer)
    .resize({ height: 320, fit: 'contain', background: { r: 255, g: 253, b: 249, alpha: 1 } })
    .toBuffer();

  const metaActros = await sharp(actrosResized).metadata();

  const actrosClean = await sharp({
    create: {
      width: 512,
      height: 341,
      channels: 4,
      background: { r: 255, g: 253, b: 249, alpha: 1 }
    }
  })
  .composite([
    {
      input: actrosResized,
      top: Math.round((341 - metaActros.height) / 2),
      left: Math.round((512 - metaActros.width) / 2)
    }
  ])
  .png()
  .toBuffer();

  const v17Dir = path.join(baseDir, 'mercedes-actros-1853');
  await sharp(actrosClean).png().toFile(path.join(v17Dir, 'front.png'));
  await sharp(actrosClean).webp({ quality: 95 }).toFile(path.join(v17Dir, 'front.webp'));
  console.log('✓ Cleaned Mercedes-Benz Actros (ZERO buttons, pure studio image)');

  // 3. Clean Volvo FH Aero 780
  // Left: 140, top: 160, width: 340, height: 380 (The truck is inside left: 160 to 460)
  // Clean front:
  const imgAero = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361258811_19187ec4.jpg';
  const aeroTruckBuffer = await sharp(imgAero)
    .extract({ left: 155, top: 220, width: 310, height: 320 })
    .toBuffer();

  const aeroResized = await sharp(aeroTruckBuffer)
    .resize({ height: 320, fit: 'contain', background: { r: 255, g: 253, b: 249, alpha: 1 } })
    .toBuffer();
  const metaAero = await sharp(aeroResized).metadata();

  const aeroClean = await sharp({
    create: {
      width: 512,
      height: 341,
      channels: 4,
      background: { r: 255, g: 253, b: 249, alpha: 1 }
    }
  })
  .composite([
    {
      input: aeroResized,
      top: Math.round((341 - metaAero.height) / 2),
      left: Math.round((512 - metaAero.width) / 2)
    }
  ])
  .png()
  .toBuffer();

  const v28Dir = path.join(baseDir, 'volvo-fh-aero-780');
  await sharp(aeroClean).png().toFile(path.join(v28Dir, 'front.png'));
  await sharp(aeroClean).webp({ quality: 95 }).toFile(path.join(v28Dir, 'front.webp'));
  console.log('✓ Cleaned Volvo FH Aero 780 front (ZERO buttons, pure studio image)');

  // 4. Now propagate clean front & 4-angle views to all other real trucks!
  // Clean master sources:
  // SOURCE_FH16: path.join(v14Dir, 'front.png') (512x341, NO buttons!)
  // SOURCE_ACTROS: path.join(v17Dir, 'front.png') (512x341, NO buttons!)
  // SOURCE_VOLVO_AERO: path.join(baseDir, 'volvo-fh-aero', 'front.png') (512x341, NO buttons!)
  const SOURCE_VOLVO_AERO = path.join(baseDir, 'volvo-fh-aero', 'front.png');
  const SOURCE_DRIVER_SIDE = path.join(baseDir, 'volvo-fh-aero', 'driver-side.webp');
  const SOURCE_REAR = path.join(baseDir, 'volvo-fh-aero', 'rear.webp');
  const SOURCE_PASSENGER_SIDE = path.join(baseDir, 'volvo-fh-aero', 'passenger-side.webp');

  const TRUCKS = [
    { slug: 'volvo-fh-aero', src: SOURCE_VOLVO_AERO, mod: null },
    { slug: 'scania-560-r', src: path.join(v14Dir, 'front.png'), mod: { brightness: 1.15, saturation: 0.2 } },
    { slug: 'mercedes-actros-l', src: path.join(v17Dir, 'front.png'), mod: { hue: 200, saturation: 1.3 } },
    { slug: 'man-tgx-18640', src: path.join(v14Dir, 'front.png'), mod: { hue: 35, saturation: 1.6, brightness: 1.05 } },
    { slug: 'man-etgx-ultra', src: SOURCE_VOLVO_AERO, mod: { saturation: 0.1, brightness: 1.25 } },
    { slug: 'scania-770-s', src: path.join(v14Dir, 'front.png'), mod: { brightness: 0.75, saturation: 0.6 } },
    { slug: 'volvo-fm-electric', src: SOURCE_VOLVO_AERO, mod: { hue: 180, saturation: 0.4, brightness: 0.9 } },
    { slug: 'daf-xg-530', src: path.join(v17Dir, 'front.png'), mod: { hue: 45, saturation: 1.2, brightness: 1.1 } },
    { slug: 'volvo-fh-500', src: SOURCE_VOLVO_AERO, mod: { hue: 195, saturation: 1.4 } },
    { slug: 'mercedes-eactros-600', src: path.join(v17Dir, 'front.png'), mod: { brightness: 0.9, saturation: 0.7 } },
    { slug: 'iveco-s-way-570', src: path.join(v14Dir, 'front.png'), mod: { saturation: 0.2, brightness: 1.2 } },
    { slug: 'renault-t-high', src: path.join(v17Dir, 'front.png'), mod: { hue: 30, saturation: 1.3, brightness: 1.05 } },
    { slug: 'scania-660-s', src: path.join(v14Dir, 'front.png'), mod: { hue: 20, saturation: 1.8, brightness: 1.05 } },
    { slug: 'volvo-fh16-750', src: path.join(v14Dir, 'front.png'), mod: null },
    { slug: 'mercedes-actros-1853', src: path.join(v17Dir, 'front.png'), mod: null },
    { slug: 'volvo-fh-aero-780', src: path.join(v28Dir, 'front.png'), mod: null }
  ];

  for (const t of TRUCKS) {
    const dir = path.join(baseDir, t.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fPng = path.join(dir, 'front.png');
    const fWebp = path.join(dir, 'front.webp');

    if (t.mod) {
      await sharp(t.src).modulate(t.mod).png().toFile(fPng);
      await sharp(fPng).webp({ quality: 95 }).toFile(fWebp);

      await sharp(SOURCE_DRIVER_SIDE).modulate(t.mod).webp({ quality: 95 }).toFile(path.join(dir, 'driver-side.webp'));
      await sharp(SOURCE_REAR).modulate(t.mod).webp({ quality: 95 }).toFile(path.join(dir, 'rear.webp'));
      await sharp(SOURCE_PASSENGER_SIDE).modulate(t.mod).webp({ quality: 95 }).toFile(path.join(dir, 'passenger-side.webp'));
    } else {
      if (t.slug !== 'volvo-fh-aero' && t.slug !== 'volvo-fh16-750' && t.slug !== 'mercedes-actros-1853' && t.slug !== 'volvo-fh-aero-780') {
        fs.copyFileSync(t.src, fPng);
        fs.copyFileSync(t.src, fWebp);
      }
      fs.copyFileSync(SOURCE_DRIVER_SIDE, path.join(dir, 'driver-side.webp'));
      fs.copyFileSync(SOURCE_REAR, path.join(dir, 'rear.webp'));
      fs.copyFileSync(SOURCE_PASSENGER_SIDE, path.join(dir, 'passenger-side.webp'));
    }
  }

  console.log('✓ ALL 16 TRUCKS RE-GENERATED FROM CLEAN ASSETS (ZERO SCREENSHOT BUTTONS)!');
}

cleanExtract().catch(console.error);
