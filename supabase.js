const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase bağlantısı kuruldu');
} else {
  console.log('⚠️ SUPABASE_URL veya SUPABASE_KEY eksik - yerel dosya kullanılacak');
}

module.exports = supabase;