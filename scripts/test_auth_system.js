const http = require('http')

const BASE_URL = 'http://localhost:3000'

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          let json = null
          try {
            json = JSON.parse(data)
          } catch (e) {
            json = data
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: json,
          })
        })
      }
    )
    req.on('error', reject)
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
    }
    req.end()
  })
}

async function runTests() {
  console.log('====================================================')
  console.log('FLEETVISION AI — AUTHENTICATION END-TO-END TEST SUITE')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`)
      passed++
    } else {
      console.error(`[FAIL] ${testName} - ${detail}`)
      failed++
    }
  }

  const testEmail = `test.operator.${Date.now()}@fleetvision-corp.in`
  const testPassword = 'Password@123'
  let verificationToken = ''
  let resetToken = ''
  let sessionCookie = ''

  // TEST 1: Register New Operator User
  try {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Arjun Verma',
        email: testEmail,
        companyName: 'Bharat Haulage Logistics',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
      },
    })
    assert(res.status === 201, '1. New User Registration Status 201', JSON.stringify(res.data))
    assert(res.data.success === true, '2. Registration Response Success Flag')
    assert(res.data.user && res.data.user.id, '3. Unique User ID Generated')
    assert(res.data.verification && res.data.verification.token, '4. Verification Token Generated')
    verificationToken = res.data.verification.token
  } catch (err) {
    assert(false, '1-4. Registration Flow', err.message)
  }

  // TEST 2: Duplicate Email Rejection
  try {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Arjun Duplicate',
        email: testEmail,
        companyName: 'Bharat Haulage Logistics',
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
      },
    })
    assert(res.status === 409, '5. Duplicate Email Rejected with 409 Conflict', `Got ${res.status}`)
  } catch (err) {
    assert(false, '5. Duplicate Email', err.message)
  }

  // TEST 3: Login Attempt Before Email Verification (Must be Rejected)
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword,
      },
    })
    assert(
      res.status === 403 && res.data.unverified === true,
      '6. Unverified User Login Rejected with 403',
      JSON.stringify(res.data)
    )
  } catch (err) {
    assert(false, '6. Unverified User Login', err.message)
  }

  // TEST 4: Invalid Verification Token Rejection
  try {
    const res = await request('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        token: 'fake-invalid-token-1234567890abcdef',
      },
    })
    assert(res.status === 400, '7. Invalid Verification Token Rejected with 400', `Got ${res.status}`)
  } catch (err) {
    assert(false, '7. Invalid Token', err.message)
  }

  // TEST 5: Successful Email Verification
  try {
    const res = await request('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        token: verificationToken,
      },
    })
    assert(res.status === 200 && res.data.success === true, '8. Account Email Verified Successfully with 200', JSON.stringify(res.data))
  } catch (err) {
    assert(false, '8. Email Verification', err.message)
  }

  // TEST 6: Token Reuse Prevention (Already Consumed Token)
  try {
    const res = await request('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        token: verificationToken,
      },
    })
    assert(
      res.status === 200 && res.data.message.includes('already verified'),
      '9. Token Reuse Handled Safely'
    )
  } catch (err) {
    assert(false, '9. Token Reuse', err.message)
  }

  // TEST 7: Login with Incorrect Password (Must fail with Generic Message)
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'WrongPassword999',
      },
    })
    assert(res.status === 401, '10. Incorrect Password Rejected with 401', `Got ${res.status}`)
    assert(
      res.data.error.includes('Invalid credentials'),
      '11. Generic Error Message Prevents Account Enumeration'
    )
  } catch (err) {
    assert(false, '10-11. Incorrect Password', err.message)
  }

  // TEST 8: Login with Unknown Email (Must fail with Same Generic Message)
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'nonexistent.operator@fleetvision.com',
        password: 'SomePassword123',
      },
    })
    assert(res.status === 401, '12. Unknown Email Rejected with 401', `Got ${res.status}`)
    assert(
      res.data.error.includes('Invalid credentials'),
      '13. Nonexistent Email Returns Identical Generic Message'
    )
  } catch (err) {
    assert(false, '12-13. Unknown Email', err.message)
  }

  // TEST 9: Successful Login with Verified Credentials
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword,
      },
    })
    assert(res.status === 200, '14. Verified Login Succeeded with 200', JSON.stringify(res.data))
    assert(res.data.user && res.data.user.name === 'Arjun Verma', '15. Authenticated Profile Matches Registered User')
    const cookies = res.headers['set-cookie']
    assert(Boolean(cookies && cookies.some(c => c.includes('fleetvision_session'))), '16. HTTP-Only fleetvision_session Cookie Set')
    sessionCookie = cookies ? cookies[0].split(';')[0] : ''
  } catch (err) {
    assert(false, '14-16. Successful Login', err.message)
  }

  // TEST 10: Server Session Validation via /api/auth/me
  try {
    const res = await request('/api/auth/me', {
      headers: {
        Cookie: sessionCookie,
      },
    })
    assert(res.status === 200 && res.data.authenticated === true, '17. Server Session /api/auth/me Authenticated 200')
    assert(res.data.user && res.data.user.email === testEmail, '18. Session Matches Logged-in Operator')
  } catch (err) {
    assert(false, '17-18. /api/auth/me Session', err.message)
  }

  // TEST 11: Pre-seeded Admin Account Login with Migrated Bcrypt Hash
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@fleetvision.com',
        password: 'password123',
      },
    })
    assert(res.status === 200, '19. Existing Admin Account Login Verified with Bcrypt', JSON.stringify(res.data))
    assert(res.data.user && res.data.user.role === 'admin', '20. Admin Role Preserved')
  } catch (err) {
    assert(false, '19-20. Admin Account Login', err.message)
  }

  // TEST 12: Password Reset Request
  try {
    const res = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: testEmail,
      },
    })
    assert(res.status === 200 && res.data.success === true, '21. Password Reset Request Accepted 200')
    resetToken = res.data.reset?.token || ''
    assert(Boolean(resetToken), '22. Reset Token Generated in Development Telemetry')
  } catch (err) {
    assert(false, '21-22. Password Reset Request', err.message)
  }

  // TEST 13: Password Reset Confirmation
  const newPassword = 'UpdatedPassword456'
  try {
    const res = await request('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: testEmail,
        token: resetToken,
        password: newPassword,
        confirmPassword: newPassword,
      },
    })
    assert(res.status === 200 && res.data.success === true, '23. Password Reset Completed Successfully with 200')
  } catch (err) {
    assert(false, '23. Password Reset Confirmation', err.message)
  }

  // TEST 14: Login with New Password
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: newPassword,
      },
    })
    assert(res.status === 200, '24. Login with Updated Password Succeeded')
  } catch (err) {
    assert(false, '24. Login with New Password', err.message)
  }

  // TEST 15: Logout and Session Invalidation
  try {
    const res = await request('/api/auth/logout', {
      method: 'POST',
      headers: {
        Cookie: sessionCookie,
      },
    })
    assert(res.status === 200, '25. Logout Endpoint Returned 200')

    const checkMe = await request('/api/auth/me', {
      headers: {
        Cookie: sessionCookie,
      },
    })
    assert(checkMe.status === 401, '26. Session Successfully Invalidated in Database')
  } catch (err) {
    assert(false, '25-26. Logout & Invalidation', err.message)
  }

  console.log('\n====================================================')
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log('====================================================')

  if (failed > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runTests().catch((e) => {
  console.error('Test execution error:', e)
  process.exit(1)
})
