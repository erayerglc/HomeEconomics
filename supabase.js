const { createClient } = require('@supabase/supabase-js');

//const supabaseUrl = process.env.SUPABASE_URL;
const supabaseUrl = "https://wflecsrbpbbtkdxktufx.supabase.co";
//const supabaseKey = process.env.SUPABASE_KEY;
//const supabaseKey = "sb_publishable_OE9SuQq5998hIkROUAbIMQ_R4KvfYwE";
//const supabaseKey = "sb_secret_kfqULWj999dD3Rd4VVAisQ_jMMSNFFq";
const supabaseKey = "sb_publishable_OE9SuQq5998hIkROUAbIMQ_R4KvfYwE";



let supabase = null;

if (supabaseUrl && supabaseKey) {
  console.log(supabaseUrl);
  console.log(supabaseKey);
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase bağlantısı kuruldu');
} else {
  console.log('⚠️ SUPABASE_URL veya SUPABASE_KEY eksik - yerel dosya kullanılacak');
}

module.exports = supabase;