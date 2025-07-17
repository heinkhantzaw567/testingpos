// Simple test to check database connection
import { getCustomers } from './lib/database';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const customers = await getCustomers();
    console.log('✅ Success! Found', customers.length, 'customers');
    console.log('Sample data:', customers[0]);
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.message.includes('relation "customers" does not exist')) {
      console.log('\n🔧 Fix: You need to create the customers table in Supabase');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Open SQL Editor');
      console.log('3. Copy/paste from database/schema.sql');
    }
  }
}

testConnection();
