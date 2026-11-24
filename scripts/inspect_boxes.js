const sharp = require('sharp');
const path = require('path');

async function inspectBox() {
  const imgActros = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361250105_5ae49518.jpg';
  // media_1795361250105_5ae49518.jpg is 1024 x 672
  // Where is the truck?
  // The truck is roughly centered between x: 300 and 720, y: 140 to 450!
  // The VIEW UNIT button is at bottom-right (x: 870, y: 410)
  // The 360 badge is at top-right (x: 910, y: 150)
  console.log('Actros truck is in center without the buttons!');

  const imgFh16 = 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/.user_uploaded/media_1795361230441_a04faf3c.jpg';
  // 735 x 851
  // Where is the truck?
  // Truck is centered: x: 190 to 545, y: 200 to 570
  // 360 View badge is at x: 70, y: 550
  // VIEW UNIT button is at x: 550, y: 550
  console.log('FH16 truck is in center without the buttons!');
}

inspectBox().catch(console.error);
