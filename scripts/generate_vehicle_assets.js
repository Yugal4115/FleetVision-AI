const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_DIR = path.join(__dirname, '..', 'public', 'assets', 'vehicles');

const VEHICLE_CONFIGS = [
  {
    slug: 'bajaj-re-e-tec-9',
    id: 'cmwqlxmad001204nssegd1u6q',
    vehicleNumber: 'FV-014',
    manufacturer: 'Bajaj',
    model: 'Bajaj RE E-Tec 9.0',
    type: 'three_wheeler_auto',
    primaryColor: '#16a34a', // Eco green
    secondaryColor: '#facc15', // Yellow canopy
    accentColor: '#15803d',
    chassisType: 'auto_rickshaw',
  },
  {
    slug: 'piaggio-ape-xtra',
    id: 'cmwqlxma7001004nsmewojo5v',
    vehicleNumber: 'FV-013',
    manufacturer: 'Piaggio',
    model: 'Piaggio Ape Xtra',
    type: 'three_wheeler_cargo',
    primaryColor: '#ca8a04', // Industrial Yellow
    secondaryColor: '#1e293b', // Black cab roof
    accentColor: '#854d0e',
    chassisType: 'three_wheeler_cargo',
  },
  {
    slug: 'tata-ace',
    id: 'cmwqlxm8d000c04nsa1epmgyc',
    vehicleNumber: 'FV-001',
    manufacturer: 'Tata',
    model: 'Tata Ace',
    type: 'mini_truck',
    primaryColor: '#f8fafc', // Polar White
    secondaryColor: '#0284c7', // Sky Blue stripe
    accentColor: '#cbd5e1',
    chassisType: 'cab_over_mini',
  },
  {
    slug: 'tata-intra-v30',
    id: 'cmwqlxm9m000s04nsy51ord7r',
    vehicleNumber: 'FV-009',
    manufacturer: 'Tata',
    model: 'Tata Intra V30',
    type: 'compact_truck',
    primaryColor: '#0d9488', // Teal Cyan
    secondaryColor: '#115e59',
    accentColor: '#14b8a6',
    chassisType: 'compact_flatbed',
  },
  {
    slug: 'mahindra-bolero-pickup',
    id: 'cmwqlxm8j000e04ns9ab0c0ce',
    vehicleNumber: 'FV-002',
    manufacturer: 'Mahindra',
    model: 'Mahindra Bolero Pickup',
    type: 'pickup_truck',
    primaryColor: '#e2e8f0', // Metallic Silver
    secondaryColor: '#1e293b', // Rugged black trim
    accentColor: '#94a3b8',
    chassisType: 'bonnet_pickup',
  },
  {
    slug: 'ashok-leyland-dost',
    id: 'cmwqlxm8p000g04nsnhbwram3',
    vehicleNumber: 'FV-003',
    manufacturer: 'Ashok Leyland',
    model: 'Ashok Leyland Dost',
    type: 'pickup_truck',
    primaryColor: '#1e40af', // Royal Blue
    secondaryColor: '#f8fafc', // White deck
    accentColor: '#1d4ed8',
    chassisType: 'sloped_pickup',
  },
  {
    slug: 'tata-407',
    id: 'cmwqlxm8u000i04nsn19343z6',
    vehicleNumber: 'FV-004',
    manufacturer: 'Tata',
    model: 'Tata 407',
    type: 'light_truck',
    primaryColor: '#eab308', // Commercial Amber-Yellow
    secondaryColor: '#78350f', // Dark amber trim
    accentColor: '#ca8a04',
    chassisType: 'medium_duty_truck',
  },
  {
    slug: 'eicher-pro-2049',
    id: 'cmwqlxm90000k04nsvyqtec48',
    vehicleNumber: 'FV-005',
    manufacturer: 'Eicher',
    model: 'Eicher Pro 2049',
    type: 'medium_truck',
    primaryColor: '#f1f5f9', // Clean White
    secondaryColor: '#dc2626', // Eicher Red stripe
    accentColor: '#64748b',
    chassisType: 'heavy_commercial',
  },
  {
    slug: 'mahindra-scorpio-s11',
    id: 'cmwqlxm95000m04nstn2n5sih',
    vehicleNumber: 'FV-006',
    manufacturer: 'Mahindra',
    model: 'Mahindra Scorpio S11',
    type: 'fleet_suv',
    primaryColor: '#0f172a', // Obsidian Black
    secondaryColor: '#334155', // Charcoal accents
    accentColor: '#64748b',
    chassisType: 'fleet_suv',
  },
  {
    slug: 'tata-yodha-pickup',
    id: 'cmwqlxm9b000o04nsiihd1sg3',
    vehicleNumber: 'FV-007',
    manufacturer: 'Tata',
    model: 'Tata Yodha Pickup',
    type: 'pickup_truck',
    primaryColor: '#475569', // Slate Grey
    secondaryColor: '#0f172a',
    accentColor: '#64748b',
    chassisType: 'bonnet_pickup',
  },
  {
    slug: 'ashok-leyland-bada-dost',
    id: 'cmwqlxm9h000q04ns9currgue',
    vehicleNumber: 'FV-008',
    manufacturer: 'Ashok Leyland',
    model: 'Ashok Leyland Bada Dost',
    type: 'light_truck',
    primaryColor: '#94a3b8', // Silver Mist
    secondaryColor: '#0284c7', // Blue graphic
    accentColor: '#64748b',
    chassisType: 'sloped_pickup',
  },
  {
    slug: 'eicher-pro-2055x',
    id: 'cmwqlxm9r000u04nsv9ohuatd',
    vehicleNumber: 'FV-010',
    manufacturer: 'Eicher',
    model: 'Eicher Pro 2055X',
    type: 'heavy_truck',
    primaryColor: '#ea580c', // Heavy Orange
    secondaryColor: '#1e293b', // Black chassis
    accentColor: '#c2410c',
    chassisType: 'heavy_commercial',
  },
  {
    slug: 'mahindra-supro',
    id: 'cmwqlxm9x000w04ns6d87ma98',
    vehicleNumber: 'FV-011',
    manufacturer: 'Mahindra',
    model: 'Mahindra Supro',
    type: 'cargo_van',
    primaryColor: '#ffffff',
    secondaryColor: '#2563eb', // Blue stripe
    accentColor: '#cbd5e1',
    chassisType: 'cargo_van',
  },
  {
    slug: 'tata-winger',
    id: 'cmwqlxma2000y04ns94tomv8i',
    vehicleNumber: 'FV-012',
    manufacturer: 'Tata',
    model: 'Tata Winger',
    type: 'passenger_van',
    primaryColor: '#e2e8f0', // Champagne Silver
    secondaryColor: '#b45309', // Gold stripe
    accentColor: '#94a3b8',
    chassisType: 'high_roof_van',
  },
  {
    slug: 'mercedes-benz-actros',
    id: 'ref-mercedes-actros',
    vehicleNumber: 'FV-REF-01',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz Actros 1845',
    type: 'heavy_tractor',
    primaryColor: '#1d4ed8', // Royal Actros Blue
    secondaryColor: '#0f172a', // Anthracite grille
    accentColor: '#3b82f6',
    chassisType: 'heavy_tractor',
  },
];

// Helper to generate SVG string for an angle
function generateVehicleSvg(v, angle) {
  const width = 1000;
  const height = 625;

  // Background gradient and ground reflection
  const bg = `
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="75%" stop-color="#fdfbf9"/>
        <stop offset="100%" stop-color="#f5ede6"/>
      </linearGradient>
      <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(30,20,15,0.45)"/>
        <stop offset="60%" stop-color="rgba(30,20,15,0.2)"/>
        <stop offset="100%" stop-color="rgba(30,20,15,0)"/>
      </radialGradient>
      <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f172a" stop-opacity="0.85"/>
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.4"/>
      </linearGradient>
      <linearGradient id="chromeGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#94a3b8"/>
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#64748b"/>
      </linearGradient>
      <linearGradient id="wheelRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#64748b"/>
        <stop offset="40%" stop-color="#cbd5e1"/>
        <stop offset="70%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#475569"/>
      </linearGradient>
      <filter id="studioShadow" x="-10%" y="-10%" width="120%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
    <!-- Floor Studio Shadow -->
    <ellipse cx="500" cy="535" rx="380" ry="24" fill="url(#shadowGrad)"/>
  `;

  // Model-specific SVG bodies
  let content = '';

  if (v.chassisType === 'auto_rickshaw') {
    // 3-Wheeler Auto (Bajaj RE 9.0)
    if (angle === 'front') {
      content = `
        <!-- Single Front Wheel -->
        <rect x="470" y="470" width="60" height="65" rx="12" fill="#0f172a"/>
        <circle cx="500" cy="502" r="20" fill="url(#wheelRim)"/>
        <!-- Mudguard & Front Fork -->
        <path d="M455,475 Q500,440 545,475 L540,490 Q500,460 460,490 Z" fill="${v.primaryColor}"/>
        <!-- Lower Body Apse -->
        <path d="M360,450 L390,320 L610,320 L640,450 Q500,470 360,450 Z" fill="${v.primaryColor}" stroke="#0b4619" stroke-width="3"/>
        <!-- Twin Headlamps -->
        <circle cx="430" cy="385" r="18" fill="#fef08a" stroke="#ffffff" stroke-width="3"/>
        <circle cx="570" cy="385" r="18" fill="#fef08a" stroke="#ffffff" stroke-width="3"/>
        <!-- Grille & EV Badge -->
        <rect x="470" y="375" width="60" height="22" rx="4" fill="#0f172a"/>
        <text x="500" y="390" font-family="monospace" font-size="9" font-weight="900" fill="#22c55e" text-anchor="middle">⚡ EV</text>
        <!-- Windshield Cowl & Glass -->
        <path d="M385,320 L405,170 Q500,160 595,170 L615,320 Z" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="4"/>
        <!-- Wiper -->
        <line x1="500" y1="180" x2="470" y2="280" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <!-- Canopy / Roof -->
        <path d="M375,175 Q500,145 625,175 L610,195 Q500,165 390,195 Z" fill="${v.secondaryColor}" stroke="#ca8a04" stroke-width="3"/>
        <!-- Mirrors -->
        <rect x="365" y="270" width="12" height="35" rx="4" fill="#0f172a"/>
        <rect x="623" y="270" width="12" height="35" rx="4" fill="#0f172a"/>
        <!-- Plate -->
        <rect x="460" y="430" width="80" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="444" font-family="monospace" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    } else if (angle === 'driver-side' || angle === 'passenger-side') {
      const isDriver = angle === 'driver-side';
      const transform = isDriver ? '' : `transform="scale(-1, 1) translate(-1000, 0)"`;
      content = `
        <g ${transform}>
          <!-- Wheels -->
          <circle cx="280" cy="500" r="38" fill="#0f172a"/>
          <circle cx="280" cy="500" r="22" fill="url(#wheelRim)"/>
          <circle cx="760" cy="500" r="38" fill="#0f172a"/>
          <circle cx="760" cy="500" r="22" fill="url(#wheelRim)"/>
          <!-- Chassis & Body Silhouette -->
          <path d="M250,470 L280,360 L360,200 Q450,165 720,180 L800,240 L820,440 L810,480 L730,480 L720,440 L340,440 L320,480 Z" fill="${v.primaryColor}" stroke="#0b4619" stroke-width="3"/>
          <!-- Canopy Roof Top -->
          <path d="M350,205 Q520,170 730,185 L725,230 Q520,205 345,235 Z" fill="${v.secondaryColor}" stroke="#ca8a04" stroke-width="2"/>
          <!-- Cabin Side Opening (Entry) -->
          <path d="M420,230 L530,230 L530,420 L400,420 L410,290 Z" fill="#ffffff" opacity="0.9" stroke="#cbd5e1" stroke-width="3"/>
          <!-- Passenger Compartment Opening -->
          <path d="M560,230 L730,240 L710,410 L560,410 Z" fill="#ffffff" opacity="0.9" stroke="#cbd5e1" stroke-width="3"/>
          <!-- Driver Seat & Handlebar -->
          <rect x="440" y="340" width="35" height="45" rx="6" fill="#1e293b"/>
          <rect x="600" y="330" width="90" height="50" rx="8" fill="#334155"/>
          <!-- Windshield Side Profile -->
          <path d="M285,360 L355,210 L370,230 L310,360 Z" fill="url(#glassGrad)"/>
          <!-- EV Livery Badge -->
          <rect x="420" y="440" width="100" height="22" rx="4" fill="#0f172a"/>
          <text x="470" y="455" font-family="sans-serif" font-size="10" font-weight="900" fill="#22c55e" text-anchor="middle">⚡ ELECTRIC</text>
        </g>
      `;
    } else {
      // Rear View
      content = `
        <!-- Rear Wheels -->
        <rect x="300" y="470" width="55" height="60" rx="10" fill="#0f172a"/>
        <rect x="645" y="470" width="55" height="60" rx="10" fill="#0f172a"/>
        <!-- Rear Body Shell -->
        <path d="M290,460 L320,240 Q500,215 680,240 L710,460 Q500,475 290,460 Z" fill="${v.primaryColor}" stroke="#0b4619" stroke-width="3"/>
        <!-- Rear Canopy Top -->
        <path d="M315,245 Q500,215 685,245 L675,270 Q500,245 325,270 Z" fill="${v.secondaryColor}" stroke="#ca8a04" stroke-width="2"/>
        <!-- Rear Window / Passenger Opening -->
        <rect x="360" y="275" width="280" height="85" rx="14" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="3"/>
        <!-- Engine / Battery Compartment Door -->
        <rect x="370" y="385" width="260" height="65" rx="8" fill="${v.accentColor}" stroke="#0b4619" stroke-width="2"/>
        <text x="500" y="415" font-family="sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">BAJAJ RE E-TEC</text>
        <!-- Tail Lamps -->
        <rect x="325" y="415" width="30" height="35" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <rect x="645" y="415" width="30" height="35" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <!-- Rear Plate -->
        <rect x="460" y="460" width="80" height="22" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="475" font-family="monospace" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    }
  } else if (v.chassisType === 'three_wheeler_cargo') {
    // 3-Wheeler Cargo (Piaggio Ape Xtra)
    if (angle === 'front') {
      content = `
        <rect x="470" y="470" width="60" height="65" rx="12" fill="#0f172a"/>
        <circle cx="500" cy="502" r="20" fill="url(#wheelRim)"/>
        <!-- Lower Cab -->
        <path d="M350,450 L380,300 L620,300 L650,450 Q500,465 350,450 Z" fill="${v.primaryColor}" stroke="#854d0e" stroke-width="3"/>
        <!-- Single Center Cyclops Headlamp -->
        <circle cx="500" cy="380" r="22" fill="#fef08a" stroke="#ffffff" stroke-width="3"/>
        <text x="500" y="420" font-family="sans-serif" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">PIAGGIO</text>
        <!-- Windshield -->
        <path d="M380,300 L400,160 Q500,150 600,160 L620,300 Z" fill="url(#glassGrad)" stroke="#0f172a" stroke-width="4"/>
        <rect x="385" y="145" width="230" height="20" rx="4" fill="${v.secondaryColor}"/>
        <!-- Plate -->
        <rect x="460" y="435" width="80" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="449" font-family="monospace" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    } else if (angle === 'driver-side' || angle === 'passenger-side') {
      const isDriver = angle === 'driver-side';
      const transform = isDriver ? '' : `transform="scale(-1, 1) translate(-1000, 0)"`;
      content = `
        <g ${transform}>
          <circle cx="270" cy="495" r="38" fill="#0f172a"/>
          <circle cx="270" cy="495" r="22" fill="url(#wheelRim)"/>
          <circle cx="780" cy="495" r="38" fill="#0f172a"/>
          <circle cx="780" cy="495" r="22" fill="url(#wheelRim)"/>
          <!-- Front Cab -->
          <path d="M250,460 L275,340 L350,180 L480,180 L480,450 L320,450 Z" fill="${v.primaryColor}" stroke="#854d0e" stroke-width="3"/>
          <rect x="345" y="195" width="120" height="110" rx="8" fill="url(#glassGrad)"/>
          <!-- Rear Cargo Box -->
          <rect x="495" y="250" width="360" height="200" rx="8" fill="${v.secondaryColor}" stroke="#0f172a" stroke-width="3"/>
          <rect x="510" y="270" width="330" height="160" rx="4" fill="${v.primaryColor}" stroke="#854d0e" stroke-width="2"/>
          <text x="675" y="355" font-family="sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">APE XTRA CARGO</text>
        </g>
      `;
    } else {
      content = `
        <rect x="280" y="470" width="55" height="60" rx="10" fill="#0f172a"/>
        <rect x="665" y="470" width="55" height="60" rx="10" fill="#0f172a"/>
        <rect x="270" y="220" width="460" height="240" rx="10" fill="${v.secondaryColor}" stroke="#0f172a" stroke-width="3"/>
        <rect x="290" y="240" width="420" height="200" rx="6" fill="${v.primaryColor}" stroke="#854d0e" stroke-width="2"/>
        <text x="500" y="340" font-family="sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">PIAGGIO APE</text>
        <rect x="285" y="405" width="30" height="35" rx="6" fill="#dc2626"/>
        <rect x="685" y="405" width="30" height="35" rx="6" fill="#dc2626"/>
        <rect x="460" y="415" width="80" height="22" rx="3" fill="#ffffff"/>
        <text x="500" y="430" font-family="monospace" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    }
  } else if (v.chassisType === 'fleet_suv') {
    // Mahindra Scorpio S11 (SUV)
    if (angle === 'front') {
      content = `
        <!-- Wheels -->
        <rect x="210" y="440" width="75" height="90" rx="14" fill="#0f172a"/>
        <rect x="715" y="440" width="75" height="90" rx="14" fill="#0f172a"/>
        <!-- Main SUV Body -->
        <path d="M220,440 L240,290 L300,190 L700,190 L760,290 L780,440 Q500,470 220,440 Z" fill="${v.primaryColor}" stroke="#1e293b" stroke-width="3"/>
        <!-- Roof Rails -->
        <rect x="290" y="175" width="420" height="15" rx="4" fill="#64748b"/>
        <!-- Windshield -->
        <path d="M295,290 L340,205 L660,205 L705,290 Z" fill="url(#glassGrad)" stroke="#0f172a" stroke-width="3"/>
        <!-- Hood Scoop -->
        <path d="M440,310 L560,310 L545,330 L455,330 Z" fill="#334155"/>
        <!-- 7-Slot Mahindra Grille -->
        <rect x="330" y="360" width="340" height="45" rx="8" fill="#1e293b" stroke="url(#chromeGrad)" stroke-width="2"/>
        ${[0,1,2,3,4,5,6].map(i => `<rect x="${355 + i*42}" y="365" width="22" height="35" rx="4" fill="url(#chromeGrad)"/>`).join('')}
        <!-- Projector Headlamps with DRL -->
        <rect x="235" y="345" width="85" height="45" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
        <circle cx="275" cy="365" r="14" fill="#e0f2fe"/>
        <rect x="680" y="345" width="85" height="45" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
        <circle cx="725" cy="365" r="14" fill="#e0f2fe"/>
        <!-- Heavy Bumper & Fog Lamps -->
        <rect x="230" y="430" width="540" height="45" rx="10" fill="#1e293b"/>
        <circle cx="280" cy="452" r="12" fill="#fef08a"/>
        <circle cx="720" cy="452" r="12" fill="#fef08a"/>
        <!-- Plate -->
        <rect x="450" y="440" width="100" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="456" font-family="monospace" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    } else if (angle === 'driver-side' || angle === 'passenger-side') {
      const isDriver = angle === 'driver-side';
      const transform = isDriver ? '' : `transform="scale(-1, 1) translate(-1000, 0)"`;
      content = `
        <g ${transform}>
          <!-- Alloy Wheels -->
          <circle cx="270" cy="485" r="50" fill="#0f172a"/>
          <circle cx="270" cy="485" r="32" fill="url(#wheelRim)"/>
          <circle cx="750" cy="485" r="50" fill="#0f172a"/>
          <circle cx="750" cy="485" r="32" fill="url(#wheelRim)"/>
          <!-- SUV Profile Body -->
          <path d="M150,440 L160,370 L250,330 L380,210 L820,210 L870,270 L880,440 L810,440 Q750,370 690,440 L330,440 Q270,370 210,440 Z" fill="${v.primaryColor}" stroke="#1e293b" stroke-width="3"/>
          <!-- Roof Rails -->
          <rect x="380" y="195" width="430" height="15" rx="4" fill="#64748b"/>
          <!-- Windows (Front, Rear, Quarter) -->
          <path d="M385,225 L510,225 L510,320 L275,320 Z" fill="url(#glassGrad)"/>
          <rect x="525" y="225" width="150" height="95" rx="4" fill="url(#glassGrad)"/>
          <path d="M690,225 L800,225 L830,320 L690,320 Z" fill="url(#glassGrad)"/>
          <!-- Footstep / Side Cladding -->
          <rect x="330" y="450" width="360" height="16" rx="4" fill="#334155"/>
          <text x="510" y="380" font-family="sans-serif" font-size="12" font-weight="900" fill="#94a3b8">SCORPIO S11</text>
        </g>
      `;
    } else {
      content = `
        <rect x="210" y="440" width="75" height="90" rx="14" fill="#0f172a"/>
        <rect x="715" y="440" width="75" height="90" rx="14" fill="#0f172a"/>
        <path d="M220,440 L230,280 L290,190 L710,190 L770,280 L780,440 Z" fill="${v.primaryColor}" stroke="#1e293b" stroke-width="3"/>
        <rect x="290" y="175" width="420" height="15" rx="4" fill="#64748b"/>
        <!-- Rear Windshield -->
        <rect x="280" y="210" width="440" height="110" rx="8" fill="url(#glassGrad)"/>
        <!-- Vertical Tower Tail Lamps (Scorpio Signature) -->
        <rect x="235" y="230" width="35" height="170" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <rect x="730" y="230" width="35" height="170" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <!-- Rear Door Handle & Branding -->
        <text x="500" y="370" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">MAHINDRA SCORPIO</text>
        <rect x="450" y="420" width="100" height="24" rx="4" fill="#ffffff"/>
        <text x="500" y="436" font-family="monospace" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    }
  } else {
    // Commercial Trucks & Pickups (Tata Ace, 407, Intra, Eicher, Bolero, Dost, Winger, Supro, Actros)
    const isHeavy = v.chassisType === 'heavy_commercial' || v.chassisType === 'heavy_tractor' || v.chassisType === 'medium_duty_truck';
    const isVan = v.chassisType === 'high_roof_van' || v.chassisType === 'cargo_van';
    const isPickup = v.chassisType === 'bonnet_pickup' || v.chassisType === 'sloped_pickup';

    if (angle === 'front') {
      content = `
        <!-- Heavy Dual Wheels -->
        <rect x="${isHeavy ? '180' : '220'}" y="440" width="${isHeavy ? '90' : '75'}" height="90" rx="14" fill="#0f172a"/>
        <rect x="${isHeavy ? '730' : '705'}" y="440" width="${isHeavy ? '90' : '75'}" height="90" rx="14" fill="#0f172a"/>
        <!-- Truck Cab Body -->
        <path d="M${isHeavy ? '190' : '230'},450 L${isHeavy ? '200' : '240'},240 L${isHeavy ? '250' : '280'},${isHeavy ? '140' : '170'} L${isHeavy ? '750' : '720'},${isHeavy ? '140' : '170'} L${isHeavy ? '800' : '760'},240 L${isHeavy ? '810' : '770'},450 Z" fill="${v.primaryColor}" stroke="${v.secondaryColor}" stroke-width="3"/>
        <!-- High Windshield -->
        <path d="M${isHeavy ? '230' : '260'},250 L${isHeavy ? '270' : '295'},${isHeavy ? '160' : '185'} L${isHeavy ? '730' : '705'},${isHeavy ? '160' : '185'} L${isHeavy ? '770' : '740'},250 Z" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="4"/>
        <!-- Wipers -->
        <line x1="420" y1="210" x2="380" y2="245" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="580" y1="210" x2="540" y2="245" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <!-- Commercial Mirror Brackets -->
        <rect x="${isHeavy ? '145' : '190'}" y="210" width="18" height="65" rx="5" fill="#0f172a"/>
        <rect x="${isHeavy ? '837' : '792'}" y="210" width="18" height="65" rx="5" fill="#0f172a"/>
        <!-- Brand Radiator Grille -->
        <rect x="310" y="310" width="380" height="95" rx="10" fill="#0f172a" stroke="${v.secondaryColor}" stroke-width="3"/>
        <text x="500" y="345" font-family="sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">${v.manufacturer.toUpperCase()}</text>
        <text x="500" y="380" font-family="sans-serif" font-size="11" font-weight="bold" fill="${v.accentColor}" text-anchor="middle">${v.model.toUpperCase()}</text>
        <!-- Headlights -->
        <rect x="${isHeavy ? '210' : '240'}" y="350" width="80" height="45" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
        <circle cx="${isHeavy ? '250' : '280'}" cy="372" r="14" fill="#fef08a"/>
        <rect x="${isHeavy ? '710' : '680'}" y="350" width="80" height="45" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
        <circle cx="${isHeavy ? '750' : '720'}" cy="372" r="14" fill="#fef08a"/>
        <!-- Steel Bumper -->
        <rect x="${isHeavy ? '190' : '220'}" y="425" width="${isHeavy ? '620' : '560'}" height="45" rx="8" fill="#1e293b"/>
        <!-- Plate -->
        <rect x="450" y="435" width="100" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="451" font-family="monospace" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    } else if (angle === 'driver-side' || angle === 'passenger-side') {
      const isDriver = angle === 'driver-side';
      const transform = isDriver ? '' : `transform="scale(-1, 1) translate(-1000, 0)"`;
      content = `
        <g ${transform}>
          <!-- Wheels -->
          <circle cx="260" cy="485" r="${isHeavy ? '54' : '45'}" fill="#0f172a"/>
          <circle cx="260" cy="485" r="30" fill="url(#wheelRim)"/>
          <circle cx="760" cy="485" r="${isHeavy ? '54' : '45'}" fill="#0f172a"/>
          <circle cx="760" cy="485" r="30" fill="url(#wheelRim)"/>
          ${isHeavy ? `<circle cx="850" cy="485" r="54" fill="#0f172a"/><circle cx="850" cy="485" r="30" fill="url(#wheelRim)"/>` : ''}
          <!-- Cab -->
          <path d="M140,440 L160,330 L220,180 L440,180 L440,440 L140,440 Z" fill="${v.primaryColor}" stroke="${v.secondaryColor}" stroke-width="3"/>
          <rect x="225" y="200" width="180" height="110" rx="6" fill="url(#glassGrad)"/>
          <!-- Cargo Deck / Container / Van Body -->
          ${isVan ? `
            <rect x="445" y="180" width="460" height="260" rx="10" fill="${v.primaryColor}" stroke="${v.secondaryColor}" stroke-width="3"/>
            <rect x="465" y="200" width="420" height="90" rx="6" fill="url(#glassGrad)"/>
          ` : `
            <rect x="445" y="${isHeavy ? '150' : '240'}" width="${isHeavy ? '480' : '440'}" height="${isHeavy ? '280' : '190'}" rx="8" fill="${v.secondaryColor}" stroke="#1e293b" stroke-width="3"/>
            <text x="660" y="${isHeavy ? '290' : '330'}" font-family="sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">${v.manufacturer.toUpperCase()} ${v.model.toUpperCase()}</text>
          `}
          <!-- Chassis rail & fuel tank -->
          <rect x="340" y="445" width="370" height="25" rx="4" fill="#0f172a"/>
        </g>
      `;
    } else {
      content = `
        <!-- Rear Wheels -->
        <rect x="${isHeavy ? '180' : '220'}" y="440" width="${isHeavy ? '90' : '75'}" height="90" rx="14" fill="#0f172a"/>
        <rect x="${isHeavy ? '730' : '705'}" y="440" width="${isHeavy ? '90' : '75'}" height="90" rx="14" fill="#0f172a"/>
        <!-- Rear Cargo Profile -->
        <rect x="${isHeavy ? '190' : '230'}" y="${isHeavy ? '140' : '200'}" width="${isHeavy ? '620' : '540'}" height="${isHeavy ? '300' : '240'}" rx="10" fill="${v.secondaryColor}" stroke="#1e293b" stroke-width="3"/>
        <text x="500" y="${isHeavy ? '280' : '310'}" font-family="sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">${v.manufacturer.toUpperCase()}</text>
        <text x="500" y="${isHeavy ? '320' : '345'}" font-family="sans-serif" font-size="12" font-weight="bold" fill="${v.accentColor}" text-anchor="middle">${v.model.toUpperCase()}</text>
        <!-- Rear Underrun Bar (RUPD) -->
        <rect x="${isHeavy ? '200' : '240'}" y="450" width="${isHeavy ? '600' : '520'}" height="28" rx="4" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
        <!-- Tail Lamps -->
        <rect x="${isHeavy ? '210' : '250'}" y="390" width="45" height="40" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <rect x="${isHeavy ? '745' : '705'}" y="390" width="45" height="40" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <!-- Plate -->
        <rect x="450" y="445" width="100" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="500" y="461" font-family="monospace" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle">${v.vehicleNumber}</text>
      `;
    }
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${bg}
      ${content}
    </svg>
  `;
}

// Generate all files
async function generateAll() {
  console.log('Generating vehicle assets...');

  for (const v of VEHICLE_CONFIGS) {
    const targetDir = path.join(BASE_DIR, v.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const angles = ['front', 'driver-side', 'rear', 'passenger-side'];

    for (const angle of angles) {
      const svg = generateVehicleSvg(v, angle);
      const webpPath = path.join(targetDir, `${angle}.webp`);
      const pngPath = path.join(targetDir, `${angle}.png`);

      await sharp(Buffer.from(svg))
        .webp({ quality: 92 })
        .toFile(webpPath);

      await sharp(Buffer.from(svg))
        .png({ quality: 92 })
        .toFile(pngPath);

      console.log(`✓ ${v.slug}/${angle}.webp & .png generated`);
    }
  }

  // Also setup Volvo FH Aero directory with authentic reference slices
  const volvoDir = path.join(BASE_DIR, 'volvo-fh-aero');
  if (!fs.existsSync(volvoDir)) {
    fs.mkdirSync(volvoDir, { recursive: true });
  }

  const volvoSourceMap = {
    'front': path.join(BASE_DIR, 'volvo-front.png'),
    'driver-side': path.join(BASE_DIR, 'volvo-driver-side.png'),
    'rear': path.join(BASE_DIR, 'volvo-rear.png'),
    'passenger-side': path.join(BASE_DIR, 'volvo-passenger-side.png'),
  };

  for (const [angle, srcPath] of Object.entries(volvoSourceMap)) {
    if (fs.existsSync(srcPath)) {
      const destPng = path.join(volvoDir, `${angle}.png`);
      const destWebp = path.join(volvoDir, `${angle}.webp`);
      fs.copyFileSync(srcPath, destPng);
      await sharp(srcPath).webp({ quality: 95 }).toFile(destWebp);
      console.log(`✓ volvo-fh-aero/${angle}.webp & .png copied & converted`);
    }
  }

  console.log('ALL VEHICLE ASSETS SUCCESSFULLY GENERATED!');
}

generateAll().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
