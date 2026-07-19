console.log(window.supabase);
const SUPABASE_URL = "https://qgcsucowbglttqvxaves.supabase.co";
const SUPABASE_KEY = "sb_publishable_Yh_aG08ic6-45kN5JaaWFg_6yVGa1hO";

window.db = 
  window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);