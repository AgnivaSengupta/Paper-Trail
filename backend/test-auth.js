// Test script to verify authentication and dashboard API
const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

// Create axios instance with credentials (same as frontend)
const testAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

async function testAuth() {
  console.log('🔍 Testing authentication flow...');
  
  try {
    // First, check if user is authenticated by getting profile
    console.log('1. Checking authentication status...');
    const profileResponse = await testAxios.get('/api/auth/profile');
    console.log('✅ User is authenticated:', profileResponse.data);
    
    // If authenticated, try to get dashboard
    console.log('2. Fetching dashboard data...');
    const dashboardResponse = await testAxios.get('/api/dashboard-summary?range=24h');
    console.log('✅ Dashboard data:', dashboardResponse.data);
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Not authenticated. Please login first.');
      console.log('📝 To test dashboard, you need to:');
      console.log('   1. Login via the frontend app');
      console.log('   2. Ensure cookies are set');
      console.log('   3. Then try accessing dashboard');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

testAuth();