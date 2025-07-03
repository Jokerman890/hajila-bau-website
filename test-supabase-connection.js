const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Environment Variables:');
  console.log(`URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  console.log('');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing required environment variables');
    return;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('_realtime')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Connection test (expected error for _realtime table):');
      console.log(`   ${error.message}`);
      console.log('   This is normal if the table doesn\'t exist');
    } else {
      console.log('✅ Connection successful - data received');
    }
    
    // Test storage buckets
    console.log('\n🗂️  Testing Storage Access...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Storage access error:', bucketsError.message);
    } else {
      console.log('✅ Storage access successful');
      console.log(`📁 Found ${buckets.length} bucket(s):`);
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
      
      // Check for user-photos bucket
      const userPhotosBucket = buckets.find(b => b.name === 'user-photos');
      if (userPhotosBucket) {
        console.log('✅ user-photos bucket exists');
      } else {
        console.log('⚠️  user-photos bucket not found');
      }
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

testSupabaseConnection();
