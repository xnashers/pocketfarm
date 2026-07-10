const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

let supabase = null;

function getSupabase() {
  if (!supabase) {
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

module.exports = { get supabase() { return getSupabase(); } };
