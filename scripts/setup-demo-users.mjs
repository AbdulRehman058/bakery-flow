/**
 * Run this script ONCE to create demo user accounts in Supabase.
 * Usage: node scripts/setup-demo-users.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awvikepfgzhyiiyuyspw.supabase.co';
const supabaseAnonKey = 'sb_publishable_MeqRxKFDw5nN4e9uoOGWew__DqxBrvd';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEMO_USERS = [
  { email: 'admin@bakeryflow.com', password: 'admin123', role: 'admin', name: 'admin' },
  { email: 'factory@bakeryflow.com', password: 'factory123', role: 'factory', name: 'factory' },
  { email: 'driver@bakeryflow.com', password: 'driver123', role: 'driver', name: 'driver' },
  { email: 'khan@bakeryflow.com', password: 'bakery123', role: 'bakery', name: 'Khan Bakery' },
  { email: 'malik@bakeryflow.com', password: 'bakery123', role: 'bakery', name: 'Malik Sweets' },
];

async function createDemoUsers() {
  console.log('Creating demo users...\n');

  for (const user of DEMO_USERS) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: { role: user.role, name: user.name }
      }
    });

    if (error) {
      console.log(`❌ ${user.email}: ${error.message}`);
    } else {
      console.log(`✅ ${user.email} (${user.role}) created`);
    }
  }

  // Sign out after creating
  await supabase.auth.signOut();
  console.log('\nDone! Demo accounts are ready.');
  console.log('\nNote: If email confirmation is enabled, you may need to');
  console.log('disable it in Supabase Dashboard → Auth → Email → Confirm Email toggle,');
  console.log('or manually confirm the users in Auth → Users.');
}

createDemoUsers();
