const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="400" height="400" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="autobotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD074" />
      <stop offset="35%" stop-color="#F88F22" />
      <stop offset="70%" stop-color="#EA6113" />
      <stop offset="100%" stop-color="#BA3806" />
    </linearGradient>
    <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F0FF" stop-opacity="1" />
      <stop offset="70%" stop-color="#00A8FF" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0044FF" stop-opacity="0" />
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.6" flood-color="#EA6113" flood-opacity="0.9"/>
    </filter>
  </defs>

  <rect width="32" height="32" rx="8" fill="#0C1E36" />
  <rect width="32" height="32" rx="8" fill="none" stroke="#EA6113" stroke-width="1.2" />

  <!-- Glowing Cybertronian Optics Behind Mask -->
  <circle cx="10.5" cy="12.2" r="1.4" fill="url(#eyeGlow)" />
  <circle cx="21.5" cy="12.2" r="1.4" fill="url(#eyeGlow)" />

  <!-- Metallic Autobot Insignia Faceplate -->
  <path fill="url(#autobotGrad)" filter="url(#glow)" d="M25.115 5.265l0.045-1.455c-2.694-1.348-5.686-2.155-8.973-2.155s-6.653 0.807-9.347 2.155l0.045 1.455 9.115 5.981 9.115-5.981zM16 4.556c1.875 0 3.448 0.601 3.448 0.601l-3.448 2.317-3.448-2.317c0 0 1.573-0.601 3.448-0.601zM18.073 23.977v-7.020l0.468-6.035-2.541 1.671-2.479-1.671 0.53 6.035v7.020h4.022zM12.39 10.276l-6.789-4.526-0.045-1.761h-3.996l0.593 8.55 4.85 3.466h5.927l-0.54-5.729zM4.685 10.653l6.412 3.018 0.107 0.989-6.357-2.875-0.162-1.132zM4.415 7.582l6.358 3.071 0.161 1.069-6.411-2.955-0.108-1.185zM4.308 26.549l4.735 2.424v-9.412l-2.796-1.74v-1.078l-2.748-1.886 0.809 11.692zM13.054 24.992v-7.012l-3.071 1.562v10.186l1.384 0.861 1.886-4.598h5.496l1.886 4.598 1.446-0.861v-10.185l-3.071-1.562v7.012h-5.956zM14.168 27.070l-1.401 3.932h6.466l-1.4-3.932h-3.665zM19.071 16.004h5.927l4.85-3.466 0.593-8.55h-3.996l-0.046 1.762-6.79 4.526-0.538 5.728zM27.153 11.785l-6.421 3 0.171-1.114 6.412-3.018-0.162 1.132zM27.477 8.767l-6.412 3.018 0.162-1.132 6.358-3.071-0.108 1.185zM28.5 14.856l-2.747 1.886v1.078l-2.755 1.74v9.412l4.694-2.424 0.808-11.692z" />
</svg>`;

sharp(Buffer.from(svg))
  .resize(400, 400)
  .png()
  .toFile('public/assets/autobot_styled_test.png')
  .then(() => console.log('Generated autobot_styled_test.png successfully!'))
  .catch(err => console.error('Error:', err));
