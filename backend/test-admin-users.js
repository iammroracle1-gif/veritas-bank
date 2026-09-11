const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAdminUsers() {
  console.log('🧪 Testing Admin Users API\n');

  try {
    // Step 1: Login as admin to get token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@veritasbank.com',
      password: 'Admin@123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('   Token:', token.substring(0, 30) + '...\n');

    // Step 2: Fetch users using admin token
    console.log('2️⃣ Fetching users from /admin/users...');
    const usersResponse = await axios.get(`${API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Users API Response:');
    console.log('   Status:', usersResponse.status);
    console.log('   Response structure:', Object.keys(usersResponse.data));
    console.log('   Data structure:', usersResponse.data);
    console.log('');

    if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
      const users = usersResponse.data.data;
      console.log(`✅ Found ${users.length} users in database:\n`);
      
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.accountStatus}`);
        console.log(`   Account Number: ${user.accountNumber}`);
        console.log(`   Balance: $${user.account?.balance || 0}`);
        console.log('');
      });
    } else {
      console.log('❌ Unexpected response structure');
      console.log('   Expected: { data: [...] }');
      console.log('   Got:', JSON.stringify(usersResponse.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAdminUsers();
