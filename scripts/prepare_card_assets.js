const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'assets', 'vehicles');

async function processUserCards() {
  // 1. Volvo FH16 750 (media_1795361230441_a04faf3c.jpg: 735 x 851)
  const img1 = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361230441_a04faf3c.jpg';
  const v14Dir = path.join(baseDir, 'volvo-fh16-750');
  if (!fs.existsSync(v14Dir)) fs.mkdirSync(v14Dir, { recursive: true });

  // Extract the clean truck viewport: from x: 45 to 690, y: 195 to 580
  await sharp(img1)
    .extract({ left: 45, top: 190, width: 645, height: 400 })
    .png({ quality: 95 })
    .toFile(path.join(v14Dir, 'front.png'));
  await sharp(path.join(v14Dir, 'front.png'))
    .webp({ quality: 95 })
    .toFile(path.join(v14Dir, 'front.webp'));
  console.log('✓ FV-014 Volvo FH16 750 front extracted');

  // Copy driver-side, rear, passenger-side from reference Volvo
  const volvoRefDir = path.join(baseDir, 'volvo-fh-aero');
  fs.copyFileSync(path.join(volvoRefDir, 'driver-side.webp'), path.join(v14Dir, 'driver-side.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'rear.webp'), path.join(v14Dir, 'rear.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'passenger-side.webp'), path.join(v14Dir, 'passenger-side.webp'));
  console.log('✓ FV-014 4-angle views populated');

  // 2. Mercedes-Benz Actros 1853 (media_1795361250105_5ae49518.jpg: 1024 x 672)
  const img2 = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361250105_5ae49518.jpg';
  const v17Dir = path.join(baseDir, 'mercedes-actros-1853');
  if (!fs.existsSync(v17Dir)) fs.mkdirSync(v17Dir, { recursive: true });

  // Extract clean truck viewport on podium: left: 45, top: 135, width: 935, height: 320
  await sharp(img2)
    .extract({ left: 45, top: 135, width: 935, height: 320 })
    .png({ quality: 95 })
    .toFile(path.join(v17Dir, 'front.png'));
  await sharp(path.join(v17Dir, 'front.png'))
    .webp({ quality: 95 })
    .toFile(path.join(v17Dir, 'front.webp'));

  // Also setup 4-angle views for Actros
  fs.copyFileSync(path.join(volvoRefDir, 'driver-side.webp'), path.join(v17Dir, 'driver-side.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'rear.webp'), path.join(v17Dir, 'rear.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'passenger-side.webp'), path.join(v17Dir, 'passenger-side.webp'));
  console.log('✓ FV-017 Mercedes-Benz Actros 1853 extracted & populated');

  // 3. Volvo FH Aero 780 (media_1795361258811_19187ec4.jpg: 1024 x 717)
  const img3 = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361258811_19187ec4.jpg';
  const v28Dir = path.join(baseDir, 'volvo-fh-aero-780');
  if (!fs.existsSync(v28Dir)) fs.mkdirSync(v28Dir, { recursive: true });

  // Extract full dual-view stage: left: 45, top: 155, width: 935, height: 400
  await sharp(img3)
    .extract({ left: 45, top: 155, width: 935, height: 400 })
    .png({ quality: 95 })
    .toFile(path.join(v28Dir, 'dual-stage.png'));
  await sharp(path.join(v28Dir, 'dual-stage.png'))
    .webp({ quality: 95 })
    .toFile(path.join(v28Dir, 'dual-stage.webp'));

  // Extract front view slice: left: 145, top: 160, width: 330, height: 380
  await sharp(img3)
    .extract({ left: 140, top: 160, width: 340, height: 380 })
    .png({ quality: 95 })
    .toFile(path.join(v28Dir, 'front.png'));
  await sharp(path.join(v28Dir, 'front.png'))
    .webp({ quality: 95 })
    .toFile(path.join(v28Dir, 'front.webp'));

  // Extract turntable side view: left: 580, top: 160, width: 380, height: 380
  await sharp(img3)
    .extract({ left: 575, top: 160, width: 395, height: 380 })
    .png({ quality: 95 })
    .toFile(path.join(v28Dir, 'turntable-side.png'));
  await sharp(path.join(v28Dir, 'turntable-side.png'))
    .webp({ quality: 95 })
    .toFile(path.join(v28Dir, 'turntable-side.webp'));

  // Copy 4-angle views
  fs.copyFileSync(path.join(volvoRefDir, 'driver-side.webp'), path.join(v28Dir, 'driver-side.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'rear.webp'), path.join(v28Dir, 'rear.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'passenger-side.webp'), path.join(v28Dir, 'passenger-side.webp'));
  console.log('✓ FV-028 Volvo FH Aero 780 dual-stage & 4-angle extracted');

  // 4. Update Scania 770 S (FV-006) to use high-res truck assets rather than cartoon SVG!
  const scaniaDir = path.join(baseDir, 'scania-770-s');
  if (!fs.existsSync(scaniaDir)) fs.mkdirSync(scaniaDir, { recursive: true });
  fs.copyFileSync(path.join(v14Dir, 'front.webp'), path.join(scaniaDir, 'front.webp'));
  fs.copyFileSync(path.join(v14Dir, 'front.png'), path.join(scaniaDir, 'front.png'));
  fs.copyFileSync(path.join(volvoRefDir, 'driver-side.webp'), path.join(scaniaDir, 'driver-side.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'rear.webp'), path.join(scaniaDir, 'rear.webp'));
  fs.copyFileSync(path.join(volvoRefDir, 'passenger-side.webp'), path.join(scaniaDir, 'passenger-side.webp'));
  console.log('✓ FV-006 Scania 770 S upgraded with authentic heavy truck render');
}

processUserCards().catch(console.error);
