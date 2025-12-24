import { createClient } from '@supabase/supabase-js';

// 请确保你的 .env.local 文件里有这两个变量><触发一下重新部署
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);