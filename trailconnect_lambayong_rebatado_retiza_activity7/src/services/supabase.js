import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eycxluqfmvpumcqgnipe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vBP2NxlkM4VBlmc_Q6YU2g_bUUhJEDI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
