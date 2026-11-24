const path = require('path');

// Production start runner for Next.js standalone server on Render
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
process.env.PORT = process.env.PORT || '10000';

console.log(`[FleetVision Production] Starting server on ${process.env.HOSTNAME}:${process.env.PORT}...`);
const serverPath = path.resolve(__dirname, '../.next/standalone/server.js');
require(serverPath);
