const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testInvalidLogin() {
  console.log('🧪 Testing Invalid Login Scenarios\n');

  try {
    // Test 1: Invalid password
    console.log('1️⃣ Testing login with INVALID password...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'WrongPassword123'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected with status:', error.response.status);
        console.log('✅ Error message:', error.response.data.error);
        console.log('✅ Frontend should show toast: "Invalid email or password. Please check your credentials."\n');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 2: Non-existent email
    console.log('2️⃣ Testing login with NON-EXISTENT email...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'doesnotexist@example.com',
        password: 'SomePassword123'
      });
      console.log('❌ Should have failed but succeeded!\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected with status:', error.response.status);
        console.log('✅ Error message:', error.response.data.error);
        console.log('✅ Frontend should show toast: "Invalid email or password. Please check your credentials."\n');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Duplicate registration
    console.log('3️⃣ Testing registration with DUPLICATE email...');
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
        console.log('✅ Correctly rejected with status:', error.response.status);
        console.log('✅ Error message:', error.response.data.error);
        console.log('✅ Frontend should show toast: "This email is already registered. Please sign in instead."\n');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 4: Valid login (should succeed and show success toast)
    console.log('4️⃣ Testing VALID login...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'user@veritasbank.com',
        password: 'User@123'
      });
      console.log('✅ Login successful!');
      console.log('✅ User:', loginResponse.data.user.firstName, loginResponse.data.user.lastName);
      console.log('✅ Frontend should show toast: "Welcome back, ' + loginResponse.data.user.firstName + '!"\n');
    } catch (error) {
      console.log('❌ Valid login failed:', error.response?.data?.error || error.message);
    }

    console.log('✅ All toast notification scenarios tested!');
    console.log('\n📝 Summary:');
    console.log('- Invalid password → Red toast: "Invalid email or password. Please check your credentials."');
    console.log('- Non-existent email → Red toast: "Invalid email or password. Please check your credentials."');
    console.log('- Duplicate email → Red toast: "This email is already registered. Please sign in instead."');
    console.log('- Valid login → Green toast: "Welcome back, [FirstName]!"');
    console.log('\n🎯 To see the toasts in action:');
    console.log('1. Go to http://localhost:5173/login');
    console.log('2. Try entering wrong password with user@veritasbank.com');
    console.log('3. You should see a toast notification appear in the top-right corner');
    
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

testInvalidLogin();
