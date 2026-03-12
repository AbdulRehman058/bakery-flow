/**
 * Seeds the bakeries table with default bakery names.
 * Run ONCE: node scripts/seed-bakeries.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://awvikepfgzhyiiyuyspw.supabase.co',
  'sb_publishable_MeqRxKFDw5nN4e9uoOGWew__DqxBrvd'
);

const BAKERIES = [
  "Khan Bakery",
  "Malik Sweets",
  "Al-Madina Bakery",
  "City Bakery",
  "Royal Sweets",
  "New Karachi Bakery",
  "Fresho Bakery",
  "Taj Mahal Sweets",
  "Gulshan Bakery",
  "Star Bakery",
  "United Bakery",
  "Bismillah Sweets",
];

async function seed() {
  console.log('Seeding bakeries table...\n');

  for (const name of BAKERIES) {
    const { error } = await supabase.from('bakeries').upsert([{ name }], { onConflict: 'name' });
    if (error) {
      console.log(`❌ ${name}: ${error.message}`);
    } else {
      console.log(`✅ ${name}`);
    }
  }

  console.log('\nDone!');
}

seed();
