import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://awvikepfgzhyiiyuyspw.supabase.co',
  'sb_publishable_MeqRxKFDw5nN4e9uoOGWew__DqxBrvd'
);

const t = {
  "Gulab Jamun": "Gulab Jamun - گلاب جامن",
  "Rasgulla": "Rasgulla - رسگلہ",
  "Barfi": "Barfi - برفی",
  "Jalebi": "Jalebi - جلیبی",
  "Laddu": "Laddu - لڈو",
  "Kalakand": "Kalakand - قلاقند",
  "Peda": "Peda - پیڑا",
  "Cham Cham": "Cham Cham - چم چم",
  "Kaju Katli": "Kaju Katli - کاجو کتلی",
  "Soan Papdi": "Soan Papdi - سون پاپڑی",
  "Rasmalai": "Rasmalai - رس ملائی",
  "Kheer": "Kheer - کھیر",
  "Sohan Halwa": "Sohan Halwa - سوہن حلوہ",
  "Patisa": "Patisa - پتیسہ",
  "Rewri": "Rewri - ریوڑی",
  "Gajak": "Gajak - گجک",
  "Petha": "Petha - پیٹھہ",
  "Halwa": "Halwa - حلوہ",
  "Motichoor Laddu": "Motichoor Laddu - موتی چور لڈو",
  "Besan Laddu": "Besan Laddu - بیسن لڈو",
  "Zeera Biscuit": "Zeera Biscuit - زیرہ بسکٹ",
  "Butter Cookies": "Butter Cookies - مکھن کوکیز",
  "Nan Khatai": "Nan Khatai - نان خطائی",
  "Khari Biscuit": "Khari Biscuit - کھاری بسکٹ",
  "Cake Rusk": "Cake Rusk - کیک رسک",
  "Coconut Cookies": "Coconut Cookies - کھوپرا کوکیز",
  "Atta Biscuit": "Atta Biscuit - آٹا بسکٹ",
  "Cream Biscuit": "Cream Biscuit - کریم بسکٹ",
  "White Bread": "White Bread - سفید روٹی",
  "Brown Bread": "Brown Bread - براؤن روٹی",
  "Milk Bread": "Milk Bread - ملک روٹی",
  "Garlic Bread": "Garlic Bread - لہسن روٹی",
  "Bun": "Bun - بن",
  "Pav": "Pav - پاؤ",
  "Sandwich Bread": "Sandwich Bread - سینڈوچ روٹی",
  "Kulcha": "Kulcha - کلچہ",
  "Plain Rusk": "Plain Rusk - سادہ رسک",
  "Sweet Rusk": "Sweet Rusk - میٹھا رسک",
  "Elaichi Rusk": "Elaichi Rusk - الائچی رسک",
  "Suji Rusk": "Suji Rusk - سوجی رسک",
  "Milk Rusk": "Milk Rusk - ملک رسک",
  "Vanilla Cake": "Vanilla Cake - ونیلا کیک",
  "Chocolate Cake": "Chocolate Cake - چاکلیٹ کیک",
  "Black Forest": "Black Forest - بلیک فارسٹ",
  "Pineapple Cake": "Pineapple Cake - پائن ایپل کیک",
  "Full Cream Milk": "Full Cream Milk - فل کریم دودھ",
  "Toned Milk": "Toned Milk - ٹونڈ دودھ",
  "Buttermilk": "Buttermilk - لسی",
  "Cream": "Cream - بالائی/کریم",
  "Paneer": "Paneer - پنیر",
  "Khoya/Mawa": "Khoya/Mawa - کھویا/ماوا",
  "Desi Ghee": "Desi Ghee - دیسی گھی",
  "Plain Dahi": "Plain Dahi - دہی",
  "Sweet Lassi": "Sweet Lassi - میٹھی لسی",
  "Raita": "Raita - رائتہ",
  "Shrikhand": "Shrikhand - شری کھنڈ",
  "Flavored Yogurt": "Flavored Yogurt - فلیورڈ دہی",
  "Chaach": "Chaach - چھاچھ",
  "Badam (Almonds)": "Badam (Almonds) - بادام",
  "Kaju (Cashew)": "Kaju (Cashew) - کاجو",
  "Pista (Pistachios)": "Pista (Pistachios) - پستہ",
  "Kishmish (Raisins)": "Kishmish (Raisins) - کشمش",
  "Akhrot (Walnuts)": "Akhrot (Walnuts) - اخروٹ",
  "Mixed Dry Fruit": "Mixed Dry Fruit - مکس ڈرائی فروٹ",
  "Khajoor (Dates)": "Khajoor (Dates) - کھجور",
  "Charoli": "Charoli - چرولی",
  "Samosa": "Samosa - سموسہ",
  "Kachori": "Kachori - کچوری",
  "Patties": "Patties - پیٹیز",
  "Sandwich": "Sandwich - سینڈوچ",
  "Pizza Slice": "Pizza Slice - پیزا سلائس",
  "Burger": "Burger - برگر",
  "Spring Roll": "Spring Roll - سپرنگ رول",
  "Puff": "Puff - پف",
  "Veg Roll": "Veg Roll - ویج رول"
};

async function seed() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) return console.error(error);

  let c = 0;
  for (const p of products) {
    if (t[p.name]) {
      await supabase.from('products').update({ name: t[p.name] }).eq('id', p.id);
      c++;
    }
  }
  console.log('Done! Updated', c);
}
seed();
