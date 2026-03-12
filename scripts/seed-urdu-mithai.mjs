import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://awvikepfgzhyiiyuyspw.supabase.co',
  'sb_publishable_MeqRxKFDw5nN4e9uoOGWew__DqxBrvd'
);

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

const mithaiData = [
  { Name: "Sada Barfi - سادہ برفی", Unit: "kg", Step: 0.25 },
  { Name: "Special Barfi - اسپیشل برفی", Unit: "kg", Step: 0.25 },
  { Name: "Aimanabadi Barfi - ایمن آبادی برفی", Unit: "kg", Step: 0.25 },
  { Name: "Dil Peda - دل پیڑے", Unit: "kg", Step: 0.25 },
  { Name: "Pista Roll - پستہ رول", Unit: "kg", Step: 0.25 },
  { Name: "Kalakand - قلاقند", Unit: "kg", Step: 0.25 },
  { Name: "Kaju Barfi - کاجو برفی", Unit: "kg", Step: 0.25 },
  { Name: "Rasgulla - رسگلے", Unit: "kg", Step: 0.25 },
  { Name: "Burada Rasgulla - برادہ رسگلے", Unit: "kg", Step: 0.25 },
  { Name: "Khoya Rasgulla - کھویا رسگلے", Unit: "kg", Step: 0.25 },
  { Name: "Gulab Jamun - گلاب جامن", Unit: "kg", Step: 0.25 },
  { Name: "Burada Gulab Jamun - برادہ گلاب جامن", Unit: "kg", Step: 0.25 },
  { Name: "Khoya Gulab Jamun - کھویا گلاب جامن", Unit: "kg", Step: 0.25 },
  { Name: "Milky Laddu - ملکی لڈو", Unit: "kg", Step: 0.25 },
  { Name: "Besan Patisa - بیسن پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "Chocolate Patisa - چاکلیٹ پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "Gulabi Patisa - گلابی پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "Yellow Patisa - یلو پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "White Patisa - وائٹ پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "Cup Patisa - کپ پتیسہ", Unit: "kg", Step: 0.25 },
  { Name: "Meser - میسو", Unit: "kg", Step: 0.25 },
  { Name: "Andda Meser - انڈا میسو", Unit: "kg", Step: 0.25 },
  { Name: "Patisa Tikki - پتیسہ ٹکی", Unit: "kg", Step: 0.25 },
  { Name: "Sialkoti Rasgulla - سیالکوٹی رسگلے", Unit: "kg", Step: 0.25 },
  { Name: "Motichoor Laddu - موتی چور لڈو", Unit: "kg", Step: 0.25 },
  { Name: "Man Pasand - من پسند", Unit: "kg", Step: 0.25 },
  { Name: "Sohan Halwa - سوہن حلوہ", Unit: "kg", Step: 0.25 },
  { Name: "Halwa Jat - حلوہ جات", Unit: "kg", Step: 0.25 },
  { Name: "Anda Kalakand - انڈا قلاقند", Unit: "kg", Step: 0.25 },
  { Name: "Malai Faja - ملائی فاجہ", Unit: "kg", Step: 0.25 },
  { Name: "Amrati - امرتی", Unit: "kg", Step: 0.25 },
  { Name: "Coconut Laddu - کوکونٹ لڈو", Unit: "kg", Step: 0.25 },
  { Name: "Balushahi - بالوشاہی", Unit: "kg", Step: 0.25 },
  { Name: "Shakar Pare - شکر پارے", Unit: "kg", Step: 0.25 },
  { Name: "Tawa Piece - توا پیس", Unit: "pcs", Step: 1 },
  { Name: "Ras Malai Piece - رس ملائی پیس", Unit: "pcs", Step: 1 },
  { Name: "Samosa Piece - سموسہ پیس", Unit: "pcs", Step: 1 },
  { Name: "Petha - پیٹھہ", Unit: "kg", Step: 0.25 },
  { Name: "Gajrela - گجریلا", Unit: "kg", Step: 0.25 },
  { Name: "Pheoni - پھینی", Unit: "kg", Step: 0.25 }
];

async function seedMithai() {
  console.log("Seeding Urdu Mithai to Supabase...");
  
  const payload = mithaiData.map(m => ({
    id: uid(),
    name: m.Name,
    category_id: "mithai",
    unit: m.Unit,
    step: m.Step,
    is_available: true
  }));

  const { error } = await supabase.from('products').insert(payload);
  
  if (error) {
    console.error("Failed to seed mithai:", error);
  } else {
    console.log(`✅ Successfully seeded ${payload.length} Mithai to the catalog!`);
  }
}

seedMithai();
