const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testToastNotifications() {
  console.log('🧪 Testing Toast Notifications for Invalid Credentials\n');

  try {
    // Test 1: Invalid password
    console.log('1️⃣ Testing login with INVALID PASSWORD...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'WrongPassword123'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Backend correctly rejected with status 401');
        console.log('   Error message:', error.response.data.error);
        console.log('   Frontend should show: "Invalid email or password. Please check your credentials."\n');
      } else {
        console.log('❌ Unexpected status:', error.response?.status);
      }
    }

    // Test 2: Non-existent email
    console.log('2️⃣ Testing login with NON-EXISTENT EMAIL...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'SomePassword123'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Backend correctly rejected with status 401');
        console.log('   Error message:', error.response.data.error);
        console.log('   Frontend should show: "Invalid email or password. Please check your credentials."\n');
      } else {
        console.log('❌ Unexpected status:', error.response?.status);
      }
    }

    // Test 3: Duplicate email registration
    console.log('3️⃣ Testing registration with DUPLICATE EMAIL...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: 'user@veritasbank.com',
        password: 'NewPassword123',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Backend correctly rejected with status 400');
        console.log('   Error message:', error.response.data.error);
        console.log('   Frontend should show: "This email is already registered. Please sign in instead."\n');
      } else {
        console.log('❌ Unexpected status:', error.response?.status);
      }
    }

    // Test 4: Admin login with non-admin user
    console.log('4️⃣ Testing admin portal with REGULAR USER credentials...');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'User@123'
      });
      const user = response.data.user;
      if (user.role !== 'ADMIN') {
        console.log('✅ Login successful but user is not admin');
        console.log('   User role:', user.role);
        console.log('   Frontend should show: "Access denied. This portal is for administrators only."\n');
      }
    } catch (error) {
      console.log('❌ Login failed unexpectedly:', error.response?.data);
    }

    console.log('✅ All toast notification tests completed!');
    console.log('\n📋 EXPECTED TOAST NOTIFICATIONS IN UI:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Invalid Login: RED toast with "Invalid email or password. Please check your credentials."');
    console.log('2. Non-existent Email: RED toast with "Invalid email or password. Please check your credentials."');
    console.log('3. Duplicate Registration: RED toast with "This email is already registered. Please sign in instead."');
    console.log('4. Non-admin on Admin Portal: RED toast with "Access denied. This portal is for administrators only."');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

testToastNotifications();
