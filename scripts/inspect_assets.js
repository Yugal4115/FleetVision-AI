const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function inspectAssets() {
  const dir = path.join(__dirname, '..', 'public', 'assets');
  const files = [
    'login/volvo-fh16-login-reference.png',
    'vehicles/volvo-front.png',
    'vehicles/volvo-driver-side.png',
    'vehicles/volvo-rear.png',
    'vehicles/volvo-passenger-side.png',
    'vehicles/volvo-fh-aero-reference.png',
    'vehicles/volvo-fh16-750/card-preview.png',
    'vehicles/mercedes-actros-1853/card-preview.png',
    'vehicles/volvo-fh-aero-780/card-preview.png'
  ];

  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.existsSync(full)) {
      const meta = await sharp(full).metadata();
      console.log(f, ':', meta.width, 'x', meta.height, 'format:', meta.format);
    } else {
      console.log(f, ': NOT FOUND');
    }
  }
}

inspectAssets().catch(console.error);
