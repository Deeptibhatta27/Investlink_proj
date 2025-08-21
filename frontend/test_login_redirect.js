// Test script to verify login and role-based redirection
// Run this in the browser console or as a Node.js script

async function testLogin(username, password, expectedRole) {
  try {
    const response = await fetch('http://localhost:8000/api/accounts/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Login successful for ${username}`);
      console.log(`📋 Token received: ${data.access ? 'Yes' : 'No'}`);
      
      if (data.access) {
        // Decode token to get role
        const tokenPayload = JSON.parse(atob(data.access.split('.')[1]));
        const actualRole = tokenPayload.role;
        
        console.log(`🎭 User Role: ${actualRole}`);
        console.log(`🎯 Expected Role: ${expectedRole}`);
        console.log(`✅ Role Match: ${actualRole === expectedRole ? 'Yes' : 'No'}`);
        
        // Determine redirect path
        let redirectPath = '/';
        if (actualRole === 'investor') {
          redirectPath = '/investor/dashboard';
        } else if (actualRole === 'startup') {
          redirectPath = '/startup/dashboard';
        }
        
        console.log(`🔄 Redirect Path: ${redirectPath}`);
      }
    } else {
      console.log(`❌ Login failed for ${username}: ${data.detail || data.message}`);
    }
  } catch (error) {
    console.error(`❌ Error testing login for ${username}:`, error);
  }
}

// Test cases
console.log('🧪 Testing Login and Role-Based Redirection...\n');

// Test investor login
console.log('1️⃣ Testing Investor Login:');
await testLogin('admin', 'admin123', 'investor');
console.log('');

// Test startup login
console.log('2️⃣ Testing Startup Login:');
await testLogin('startup_test', 'startup123', 'startup');
console.log('');

// Test existing user
console.log('3️⃣ Testing Existing User Login:');
await testLogin('deepti123@gmail.com', 'password123', 'investor');
console.log('');

console.log('�� Test completed!'); 