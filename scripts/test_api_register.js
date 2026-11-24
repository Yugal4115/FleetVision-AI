const http = require('http');

const postData = JSON.stringify({
  name: 'nantha',
  email: 'nantha@gmail.com',
  companyName: 'nk',
  password: 'password123',
  confirmPassword: 'password123',
  acceptTerms: true
});

const req = http.request('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', data);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(postData);
req.end();
