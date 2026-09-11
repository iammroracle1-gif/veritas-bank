const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints\n');

  try {
    // Test 1: Login with existing user
    console.log('1️⃣ Testing login with existing user (user@veritasbank.com)...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'User@123'
      });
      console.log('✅ Login successful!');
      console.log('   User:', loginResponse.data.user.firstName, loginResponse.data.user.lastName);
      console.log('   Email:', loginResponse.data.user.email);
      console.log('   Balance:', loginResponse.data.user.balance);
      console.log('   Token:', loginResponse.data.token.substring(0, 20) + '...\n');
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.error || error.message);
    }

    // Test 2: Login with wrong password
    console.log('2️⃣ Testing login with wrong password...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'WrongPassword123'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected with:', error.response.data.error);
        console.log('');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Register new user
    console.log('3️⃣ Testing registration with new user...');
    const randomEmail = `test${Date.now()}@example.com`;
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        email: randomEmail,
        password: 'TestUser@123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890'
      });
      console.log('✅ Registration successful!');
      console.log('   User:', registerResponse.data.user.firstName, registerResponse.data.user.lastName);
      console.log('   Email:', registerResponse.data.user.email);
      console.log('   Account Number:', registerResponse.data.user.accountNumber);
      console.log('   Token:', registerResponse.data.token.substring(0, 20) + '...\n');
    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data?.error || error.message);
    }

    // Test 4: Register with duplicate email
    console.log('4️⃣ Testing registration with duplicate email...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: 'user@veritasbank.com',
        password: 'TestUser@123',
        firstName: 'Duplicate',
        lastName: 'User'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected with:', error.response.data.error);
        console.log('');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 5: Admin login
    console.log('5️⃣ Testing admin login (admin@veritasbank.com)...');
    try {
      const adminLoginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@veritasbank.com',
        password: 'Admin@123'
      });
      console.log('✅ Admin login successful!');
      console.log('   User:', adminLoginResponse.data.user.firstName, adminLoginResponse.data.user.lastName);
      console.log('   Role:', adminLoginResponse.data.user.role);
      console.log('   Email:', adminLoginResponse.data.user.email);
      console.log('   Token:', adminLoginResponse.data.token.substring(0, 20) + '...\n');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.error || error.message);
    }

    console.log('✅ All authentication tests completed!');
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

testAuth();
