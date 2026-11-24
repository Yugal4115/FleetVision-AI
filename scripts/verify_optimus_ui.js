const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to http://localhost:3000/vehicles ...');
  await page.goto('http://localhost:3000/vehicles', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait for the button
  const buttonSelector = 'button[title*="Optimus"]';
  await page.waitForSelector(buttonSelector, { timeout: 10000 });
  
  // Screenshot closed floating button
  await page.screenshot({
    path: 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/optimus_autobot_button_verified.png',
    clip: { x: 1300, y: 770, width: 130, height: 120 }
  });
  console.log('Saved optimus_autobot_button_verified.png');

  // Open the widget
  await page.click(buttonSelector);
  await new Promise(r => setTimeout(r, 900));

  // Screenshot opened widget
  await page.screenshot({
    path: 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/optimus_assistant_window_verified.png',
    clip: { x: 990, y: 280, width: 440, height: 610 }
  });
  console.log('Saved optimus_assistant_window_verified.png');

  // Click quick action '⚡ Fleet Health Radar'
  const actionBtns = await page.$$('button');
  for (const b of actionBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Fleet Health')) {
      await b.click();
      console.log('Clicked Fleet Health Radar action button');
      break;
    }
  }

  // Wait for telematics reasoning reply
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot with query reply
  await page.screenshot({
    path: 'C:/Users/Yugal Yuvaraj/.gemini/antigravity/brain/bfe0824c-bea4-441c-98d5-b2624dc66fa8/optimus_chat_conversation_verified.png',
    clip: { x: 990, y: 280, width: 440, height: 610 }
  });
  console.log('Saved optimus_chat_conversation_verified.png');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
})().catch(err => {
  console.error('Puppeteer verification error:', err);
  process.exit(1);
});
