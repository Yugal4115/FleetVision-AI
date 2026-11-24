const sharp = require('sharp');
const fs = require('fs');

// We will render the complete Optimus Assistant Widget to a stunning high-res PNG
const widgetSvg = `
<svg width="420" height="570" viewBox="0 0 420 570" xmlns="http://www.w3.org/2000/svg" font-family="'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif">
  <defs>
    <!-- Armor & Insignia Gradient -->
    <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2D6" />
      <stop offset="25%" stop-color="#FBB931" />
      <stop offset="60%" stop-color="#EA6113" />
      <stop offset="100%" stop-color="#A82800" />
    </linearGradient>

    <!-- Glowing Cyan Optic Flare -->
    <radialGradient id="opticGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="35%" stop-color="#00F0FF" stop-opacity="0.95" />
      <stop offset="80%" stop-color="#00F0FF" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
    </radialGradient>

    <!-- Deep Space Cockpit Background Gradient -->
    <radialGradient id="cockpitBg" cx="15%" cy="10%" r="90%">
      <stop offset="0%" stop-color="#142642" />
      <stop offset="45%" stop-color="#081222" />
      <stop offset="100%" stop-color="#040812" />
    </radialGradient>

    <!-- Color Grading Bloom: Sunset Amber -->
    <radialGradient id="sunsetBloom" cx="0%" cy="0%" r="100%">
      <stop offset="0%" stop-color="#EA6113" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#EA6113" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#EA6113" stop-opacity="0" />
    </radialGradient>

    <!-- Color Grading Bloom: Cyber Cyan -->
    <radialGradient id="cyanBloom" cx="100%" cy="60%" r="80%">
      <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.22" />
      <stop offset="50%" stop-color="#00F0FF" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
    </radialGradient>

    <!-- Drop Shadow Filters -->
    <filter id="insigniaGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#EA6113" flood-opacity="0.9"/>
    </filter>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- 1. BASE CONTAINER & BORDER -->
  <rect width="420" height="570" rx="24" fill="url(#cockpitBg)" />
  <rect width="420" height="570" rx="24" fill="none" stroke="#EA6113" stroke-width="1.5" stroke-opacity="0.5" />

  <!-- 2. COLOR GRADING ATMOSPHERIC BLOOMS -->
  <circle cx="20" cy="20" r="140" fill="url(#sunsetBloom)" />
  <circle cx="380" cy="340" r="160" fill="url(#cyanBloom)" />

  <!-- 3. HOLOGRAPHIC GRID OVERLAY (Fine 24px cyber-grid) -->
  <g stroke="#FFFFFF" stroke-width="0.5" opacity="0.04">
    <line x1="0" y1="60" x2="420" y2="60" /><line x1="0" y1="120" x2="420" y2="120" />
    <line x1="0" y1="180" x2="420" y2="180" /><line x1="0" y1="240" x2="420" y2="240" />
    <line x1="0" y1="300" x2="420" y2="300" /><line x1="0" y1="360" x2="420" y2="360" />
    <line x1="0" y1="420" x2="420" y2="420" /><line x1="0" y1="480" x2="420" y2="480" />
    <line x1="60" y1="0" x2="60" y2="570" /><line x1="120" y1="0" x2="120" y2="570" />
    <line x1="180" y1="0" x2="180" y2="570" /><line x1="240" y1="0" x2="240" y2="570" />
    <line x1="300" y1="0" x2="300" y2="570" /><line x1="360" y1="0" x2="360" y2="570" />
  </g>

  <!-- 4. HEADER BAR -->
  <path d="M0 24 Q0 0 24 0 L396 0 Q420 0 420 24 L420 68 L0 68 Z" fill="#071220" fill-opacity="0.9" />
  <line x1="0" y1="68" x2="420" y2="68" stroke="#EA6113" stroke-width="1.2" stroke-opacity="0.6" />

  <!-- HEADER: AUTOBOT MEDALLION -->
  <g transform="translate(16, 12)">
    <rect width="44" height="44" rx="12" fill="#0C1D36" stroke="#EA6113" stroke-width="1.4" />
    <g transform="translate(6, 6) scale(1)">
      <!-- Glowing Cyan Optics -->
      <circle cx="10.5" cy="12.2" r="1.6" fill="url(#opticGlow)" />
      <circle cx="21.5" cy="12.2" r="1.6" fill="url(#opticGlow)" />
      <ellipse cx="10.5" cy="12.2" rx="0.7" ry="0.5" fill="#FFFFFF" />
      <ellipse cx="21.5" cy="12.2" rx="0.7" ry="0.5" fill="#FFFFFF" />
      <!-- Canonical Autobot Faceplate -->
      <path fill="url(#armorGrad)" filter="url(#insigniaGlow)" d="M25.115 5.265l0.045-1.455c-2.694-1.348-5.686-2.155-8.973-2.155s-6.653 0.807-9.347 2.155l0.045 1.455 9.115 5.981 9.115-5.981zM16 4.556c1.875 0 3.448 0.601 3.448 0.601l-3.448 2.317-3.448-2.317c0 0 1.573-0.601 3.448-0.601zM18.073 23.977v-7.020l0.468-6.035-2.541 1.671-2.479-1.671 0.53 6.035v7.020h4.022zM12.39 10.276l-6.789-4.526-0.045-1.761h-3.996l0.593 8.55 4.85 3.466h5.927l-0.54-5.729zM4.685 10.653l6.412 3.018 0.107 0.989-6.357-2.875-0.162-1.132zM4.415 7.582l6.358 3.071 0.161 1.069-6.411-2.955-0.108-1.185zM4.308 26.549l4.735 2.424v-9.412l-2.796-1.74v-1.078l-2.748-1.886 0.809 11.692zM13.054 24.992v-7.012l-3.071 1.562v10.186l1.384 0.861 1.886-4.598h5.496l1.886 4.598 1.446-0.861v-10.185l-3.071-1.562v7.012h-5.956zM14.168 27.070l-1.401 3.932h6.466l-1.4-3.932h-3.665zM19.071 16.004h5.927l4.85-3.466 0.593-8.55h-3.996l-0.046 1.762-6.79 4.526-0.538 5.728zM27.153 11.785l-6.421 3 0.171-1.114 6.412-3.018-0.162 1.132zM27.477 8.767l-6.412 3.018 0.162-1.132 6.358-3.071-0.108 1.185zM28.5 14.856l-2.747 1.886v1.078l-2.755 1.74v9.412l4.694-2.424 0.808-11.692z" />
    </g>
    <!-- Ping dot -->
    <circle cx="40" cy="4" r="3.5" fill="#00F0FF" />
  </g>

  <!-- HEADER TEXT -->
  <text x="70" y="33" fill="#FFFFFF" font-size="14" font-weight="900" letter-spacing="1.5">OPTIMUS PRIME</text>
  <rect x="195" y="22" width="46" height="15" rx="4" fill="#EA6113" />
  <text x="200" y="33" fill="#FFFFFF" font-size="8.5" font-weight="800">AI v4.8</text>
  
  <circle cx="74" cy="50" r="3" fill="#10B981" />
  <text x="82" y="53" fill="#34D399" font-size="11" font-weight="700" letter-spacing="0.8">AUTONOMOUS TELEMETRY // 100Hz</text>

  <!-- HEADER CONTROL BUTTONS -->
  <g fill="#94A3B8" transform="translate(340, 24)">
    <circle cx="12" cy="12" r="10" fill="#FFFFFF" fill-opacity="0.08" />
    <path d="M9 12 A3 3 0 1 1 15 12" stroke="#CBD5E1" stroke-width="1.2" fill="none" />
    <circle cx="36" cy="12" r="10" fill="#FFFFFF" fill-opacity="0.08" />
    <line x1="31" y1="12" x2="41" y2="12" stroke="#CBD5E1" stroke-width="1.4" />
    <circle cx="60" cy="12" r="10" fill="#FFFFFF" fill-opacity="0.08" />
    <line x1="56" y1="8" x2="64" y2="16" stroke="#CBD5E1" stroke-width="1.4" />
    <line x1="64" y1="8" x2="56" y2="16" stroke="#CBD5E1" stroke-width="1.4" />
  </g>

  <!-- 5. MESSAGE STREAM VIEWPORT -->
  <!-- MESSAGE 1: OPTIMUS PRIME WELCOME -->
  <g transform="translate(16, 85)">
    <!-- Sender Header -->
    <text x="2" y="12" fill="#FBB931" font-size="10" font-weight="800" letter-spacing="1">OPTIMUS PRIME</text>
    <rect x="94" y="2" width="138" height="13" rx="3" fill="#0A223E" stroke="#00F0FF" stroke-width="0.6" stroke-opacity="0.5" />
    <text x="98" y="11" fill="#00F0FF" font-size="8" font-weight="700">CAN-BUS RECON // 100Hz</text>
    <text x="238" y="12" fill="#94A3B8" font-size="9" font-weight="600">Just now</text>

    <!-- Message Bubble -->
    <rect x="0" y="18" width="365" height="74" rx="14" fill="#0A1628" fill-opacity="0.9" stroke="#EA6113" stroke-width="0.9" stroke-opacity="0.35" filter="url(#cardShadow)" />
    <text x="14" y="38" fill="#F1F5F9" font-size="12.5" font-weight="500">Greetings, Fleet Commander. I am Optimus Prime AI,</text>
    <text x="14" y="55" fill="#F1F5F9" font-size="12.5" font-weight="500">autonomous intelligence engine. All 16 heavy haulers and</text>
    <text x="14" y="72" fill="#F1F5F9" font-size="12.5" font-weight="500">CAN-Bus telemetry streams are online. Directives ready.</text>
  </g>

  <!-- QUICK ACTION TACTICAL CHIPS -->
  <g transform="translate(16, 184)">
    <!-- Chip 1 -->
    <rect x="0" y="0" width="168" height="26" rx="6" fill="#0D1C34" stroke="#EA6113" stroke-width="0.8" stroke-opacity="0.5" />
    <text x="10" y="17" fill="#FFE3B3" font-size="9.5" font-weight="700" letter-spacing="0.5">⚡ FLEET HEALTH RADAR</text>
    <!-- Chip 2 -->
    <rect x="176" y="0" width="168" height="26" rx="6" fill="#0D1C34" stroke="#EA6113" stroke-width="0.8" stroke-opacity="0.5" />
    <text x="186" y="17" fill="#FFE3B3" font-size="9.5" font-weight="700" letter-spacing="0.5">⛽ FUEL &amp; ENERGY AUDIT</text>
    <!-- Chip 3 -->
    <rect x="0" y="32" width="176" height="26" rx="6" fill="#0D1C34" stroke="#EA6113" stroke-width="0.8" stroke-opacity="0.5" />
    <text x="10" y="49" fill="#FFE3B3" font-size="9.5" font-weight="700" letter-spacing="0.5">🔧 PREDICTIVE SERVICE</text>
    <!-- Chip 4 -->
    <rect x="184" y="32" width="160" height="26" rx="6" fill="#0D1C34" stroke="#EA6113" stroke-width="0.8" stroke-opacity="0.5" />
    <text x="194" y="49" fill="#FFE3B3" font-size="9.5" font-weight="700" letter-spacing="0.5">🛡️ CREW SAFETY INDEX</text>
  </g>

  <!-- MESSAGE 2: COMMANDER QUERY -->
  <g transform="translate(90, 260)">
    <text x="120" y="12" fill="#F88F22" font-size="10" font-weight="800" letter-spacing="1">COMMANDER</text>
    <rect x="195" y="2" width="94" height="13" rx="3" fill="#2D140D" stroke="#EA6113" stroke-width="0.6" stroke-opacity="0.5" />
    <text x="200" y="11" fill="#FFE3B3" font-size="8" font-weight="700">AUTHORIZED OPS</text>
    
    <rect x="18" y="18" width="294" height="38" rx="14" fill="url(#armorGrad)" filter="url(#cardShadow)" />
    <text x="32" y="42" fill="#FFFFFF" font-size="12.5" font-weight="700">Analyze vehicle health radar scores across fleet</text>
  </g>

  <!-- MESSAGE 3: OPTIMUS RESPONSE -->
  <g transform="translate(16, 332)">
    <text x="2" y="12" fill="#FBB931" font-size="10" font-weight="800" letter-spacing="1">OPTIMUS PRIME</text>
    <rect x="94" y="2" width="118" height="13" rx="3" fill="#0A223E" stroke="#00F0FF" stroke-width="0.6" stroke-opacity="0.5" />
    <text x="98" y="11" fill="#00F0FF" font-size="8" font-weight="700">DIAGNOSTIC RADAR</text>
    <text x="218" y="12" fill="#94A3B8" font-size="9" font-weight="600">Just now</text>

    <rect x="0" y="18" width="375" height="92" rx="14" fill="#0A1628" fill-opacity="0.95" stroke="#EA6113" stroke-width="0.9" stroke-opacity="0.35" filter="url(#cardShadow)" />
    <text x="14" y="38" fill="#F1F5F9" font-size="12" font-weight="500">Diagnostic Radar Report: 14 haulers operating at Optimal state</text>
    <text x="14" y="55" fill="#F1F5F9" font-size="12" font-weight="500">(>92% health). Flagships FV-014 (Volvo FH16 750) and FV-017</text>
    <text x="14" y="72" fill="#F1F5F9" font-size="12" font-weight="500">(Mercedes-Benz Actros 1853) report nominal battery SoH (95%)</text>
    <text x="14" y="89" fill="#F1F5F9" font-size="12" font-weight="500">and air-brake pressure at 12.2 bar. Zero DTC faults logged.</text>
  </g>

  <!-- 6. INPUT COCKPIT BAY -->
  <path d="M0 488 L420 488 L420 546 Q420 570 396 570 L24 570 Q0 570 0 546 Z" fill="#050B16" />
  <line x1="0" y1="488" x2="420" y2="488" stroke="#EA6113" stroke-width="1" stroke-opacity="0.4" />

  <!-- Input Field -->
  <rect x="16" y="498" width="338" height="42" rx="12" fill="#0A1324" stroke="#EA6113" stroke-width="0.8" stroke-opacity="0.5" />
  <text x="30" y="524" fill="#64748B" font-size="13" font-weight="500">Command Optimus AI (e.g. Health radar, Fuel, Trips)...</text>

  <!-- Send Button -->
  <g transform="translate(362, 498)">
    <rect width="42" height="42" rx="12" fill="url(#armorGrad)" filter="url(#cardShadow)" />
    <path d="M14 21 L28 15 L22 27 L19 23 Z" fill="#FFFFFF" />
  </g>

  <!-- Status Bar -->
  <circle cx="22" cy="554" r="3" fill="#EA6113" />
  <text x="30" y="557" fill="#94A3B8" font-size="9" font-weight="600">Neural J1939 Architecture Active</text>
  <text x="340" y="557" fill="#FBB931" font-size="9" font-weight="800">FULL COCKPIT →</text>
</svg>
`;

async function render() {
  await sharp(Buffer.from(widgetSvg))
    .png()
    .toFile('C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/optimus_prime_assistant_ui_preview.png');
  console.log('Saved optimus_prime_assistant_ui_preview.png successfully!');
}
render().catch(err => console.error(err));
