const http = require('http');

const sessionCookie = 'fleetvision_session=9793a89faefbab25c05ee41489acbb82a087291c915d0203d24d06945a54f84b';

const routes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/dashboard',
  '/vehicles',
  '/vehicles/new',
  '/vehicles/explorer',
  '/vehicles/health',
  '/vehicles/documents',
  '/drivers',
  '/drivers/profiles',
  '/drivers/safety',
  '/drivers/performance',
  '/drivers/documents',
  '/drivers/new',
  '/trips',
  '/trips/new',
  '/trips/routes',
  '/trips/history',
  '/trips/pnl',
  '/fuel',
  '/fuel/analytics',
  '/maintenance',
  '/maintenance/schedule',
  '/maintenance/history',
  '/maintenance/repairs',
  '/expenses',
  '/reports',
  '/ai-center',
  '/ai-assistant',
  '/tracking',
  '/settings',
  '/profile',
  '/users',
  '/notifications',
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.request(`http://localhost:3000${route}`, {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          length: data.length,
          titleMatch: data.includes('<title>') ? data.match(/<title>(.*?)<\/title>/)?.[1] : null,
          hasError: data.includes('Internal Server Error') || data.includes('Application error')
        });
      });
    });
    req.on('error', (err) => {
      resolve({ route, status: 'ERROR', error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log('--- AUDITING ALL APP ROUTES ---');
  const results = [];
  for (const r of routes) {
    const res = await checkRoute(r);
    results.push(res);
    const mark = (res.status === 200 && !res.hasError) ? '✓ OK' : '✗ FAIL';
    console.log(`${mark} [${res.status}] ${r.padEnd(25)} length: ${res.length}`);
  }
  
  const failed = results.filter(r => r.status !== 200 || r.hasError);
  console.log(`\nAUDIT FINISHED: ${results.length - failed.length}/${results.length} PASSED.`);
  if (failed.length > 0) {
    console.log('FAILED ROUTES:', failed);
  }
}

run();
