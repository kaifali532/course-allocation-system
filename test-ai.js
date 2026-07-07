const http = require('http');

async function testAI() {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@university.edu', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    if (!loginData.token) {
      console.log('No token received');
      return;
    }

    // 2. Test AI ask
    const aiRes = await fetch('http://localhost:5000/api/ai/ask', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ query: 'Hello, what can you do?' })
    });
    const aiData = await aiRes.json();
    console.log('AI Response:', aiData);
  } catch (err) {
    console.error('Error:', err);
  }
}

testAI();
