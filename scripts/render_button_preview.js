const sharp = require('sharp');

const buttonSvg = `
<svg width="280" height="140" viewBox="0 0 280 140" xmlns="http://www.w3.org/2000/svg" font-family="'Orbitron', sans-serif">
  <defs>
    <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2D6" />
      <stop offset="25%" stop-color="#FBB931" />
      <stop offset="60%" stop-color="#EA6113" />
      <stop offset="100%" stop-color="#A82800" />
    </linearGradient>
    <radialGradient id="opticGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="35%" stop-color="#00F0FF" stop-opacity="0.95" />
      <stop offset="80%" stop-color="#00F0FF" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#EA6113" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#EA6113" stop-opacity="0" />
    </radialGradient>
    <filter id="insigniaGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#EA6113" flood-opacity="0.9"/>
    </filter>
  </defs>

  <rect width="280" height="140" fill="#FFF8F2" />

  <!-- STATE 1: NORMAL TRIGGER BUTTON -->
  <g transform="translate(40, 35)">
    <!-- Halo -->
    <circle cx="35" cy="35" r="42" fill="url(#haloGlow)" />
    <!-- Tactical Squircle -->
    <rect width="70" height="70" rx="20" fill="#0C1D36" stroke="#EA6113" stroke-width="2.5" />
    <!-- Autobot Emblem with Glowing Optics -->
    <g transform="translate(15, 15) scale(1.25)">
      <circle cx="10.5" cy="12.2" r="1.6" fill="url(#opticGlow)" />
      <circle cx="21.5" cy="12.2" r="1.6" fill="url(#opticGlow)" />
      <ellipse cx="10.5" cy="12.2" rx="0.7" ry="0.5" fill="#FFFFFF" />
      <ellipse cx="21.5" cy="12.2" rx="0.7" ry="0.5" fill="#FFFFFF" />
      <path fill="url(#armorGrad)" filter="url(#insigniaGlow)" d="M25.115 5.265l0.045-1.455c-2.694-1.348-5.686-2.155-8.973-2.155s-6.653 0.807-9.347 2.155l0.045 1.455 9.115 5.981 9.115-5.981zM16 4.556c1.875 0 3.448 0.601 3.448 0.601l-3.448 2.317-3.448-2.317c0 0 1.573-0.601 3.448-0.601zM18.073 23.977v-7.020l0.468-6.035-2.541 1.671-2.479-1.671 0.53 6.035v7.020h4.022zM12.39 10.276l-6.789-4.526-0.045-1.761h-3.996l0.593 8.55 4.85 3.466h5.927l-0.54-5.729zM4.685 10.653l6.412 3.018 0.107 0.989-6.357-2.875-0.162-1.132zM4.415 7.582l6.358 3.071 0.161 1.069-6.411-2.955-0.108-1.185zM4.308 26.549l4.735 2.424v-9.412l-2.796-1.74v-1.078l-2.748-1.886 0.809 11.692zM13.054 24.992v-7.012l-3.071 1.562v10.186l1.384 0.861 1.886-4.598h5.496l1.886 4.598 1.446-0.861v-10.185l-3.071-1.562v7.012h-5.956zM14.168 27.070l-1.401 3.932h6.466l-1.4-3.932h-3.665zM19.071 16.004h5.927l4.85-3.466 0.593-8.55h-3.996l-0.046 1.762-6.79 4.526-0.538 5.728zM27.153 11.785l-6.421 3 0.171-1.114 6.412-3.018-0.162 1.132zM27.477 8.767l-6.412 3.018 0.162-1.132 6.358-3.071-0.108 1.185zM28.5 14.856l-2.747 1.886v1.078l-2.755 1.74v9.412l4.694-2.424 0.808-11.692z" />
    </g>
    <!-- Emerald Online Beacon -->
    <circle cx="64" cy="6" r="4.5" fill="#10B981" stroke="#040812" stroke-width="1.5" />
    <text x="-10" y="86" fill="#84492D" font-size="10" font-weight="700">REST STATE</text>
  </g>

  <!-- STATE 2: HOVER ACTIVE PULSE -->
  <g transform="translate(170, 35)">
    <!-- Cyan Halo on Hover -->
    <circle cx="35" cy="35" r="46" fill="#EA6113" fill-opacity="0.3" />
    <!-- Rotating Dashed Radar Reticle -->
    <rect x="-4" y="-4" width="78" height="78" rx="24" fill="none" stroke="#FBB931" stroke-width="1.2" stroke-dasharray="6,4" />
    <!-- Squircle with Gold Border -->
    <rect width="70" height="70" rx="20" fill="#0C1D36" stroke="#FBB931" stroke-width="2.5" />
    <!-- Autobot Emblem with Flaring Optics -->
    <g transform="translate(15, 15) scale(1.25)">
      <circle cx="10.5" cy="12.2" r="2.2" fill="url(#opticGlow)" />
      <circle cx="21.5" cy="12.2" r="2.2" fill="url(#opticGlow)" />
      <ellipse cx="10.5" cy="12.2" rx="0.9" ry="0.6" fill="#FFFFFF" />
      <ellipse cx="21.5" cy="12.2" rx="0.9" ry="0.6" fill="#FFFFFF" />
      <path fill="url(#armorGrad)" filter="url(#insigniaGlow)" d="M25.115 5.265l0.045-1.455c-2.694-1.348-5.686-2.155-8.973-2.155s-6.653 0.807-9.347 2.155l0.045 1.455 9.115 5.981 9.115-5.981zM16 4.556c1.875 0 3.448 0.601 3.448 0.601l-3.448 2.317-3.448-2.317c0 0 1.573-0.601 3.448-0.601zM18.073 23.977v-7.020l0.468-6.035-2.541 1.671-2.479-1.671 0.53 6.035v7.020h4.022zM12.39 10.276l-6.789-4.526-0.045-1.761h-3.996l0.593 8.55 4.85 3.466h5.927l-0.54-5.729zM4.685 10.653l6.412 3.018 0.107 0.989-6.357-2.875-0.162-1.132zM4.415 7.582l6.358 3.071 0.161 1.069-6.411-2.955-0.108-1.185zM4.308 26.549l4.735 2.424v-9.412l-2.796-1.74v-1.078l-2.748-1.886 0.809 11.692zM13.054 24.992v-7.012l-3.071 1.562v10.186l1.384 0.861 1.886-4.598h5.496l1.886 4.598 1.446-0.861v-10.185l-3.071-1.562v7.012h-5.956zM14.168 27.070l-1.401 3.932h6.466l-1.4-3.932h-3.665zM19.071 16.004h5.927l4.85-3.466 0.593-8.55h-3.996l-0.046 1.762-6.79 4.526-0.538 5.728zM27.153 11.785l-6.421 3 0.171-1.114 6.412-3.018-0.162 1.132zM27.477 8.767l-6.412 3.018 0.162-1.132 6.358-3.071-0.108 1.185zM28.5 14.856l-2.747 1.886v1.078l-2.755 1.74v9.412l4.694-2.424 0.808-11.692z" />
    </g>
    <!-- Active Ping Wave -->
    <circle cx="64" cy="6" r="6" fill="none" stroke="#00F0FF" stroke-width="1.2" opacity="0.8" />
    <circle cx="64" cy="6" r="4.5" fill="#10B981" stroke="#040812" stroke-width="1.5" />
    <text x="-14" y="86" fill="#EA6113" font-size="10" font-weight="800">HOVER / RADAR</text>
  </g>
</svg>
`;

sharp(Buffer.from(buttonSvg))
  .png()
  .toFile('C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/optimus_autobot_button_preview.png')
  .then(() => console.log('Saved optimus_autobot_button_preview.png'));
