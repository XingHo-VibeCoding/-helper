import { createClient } from '@supabase/supabase-js'

// 环境变量来自 web/.env(参考 .env.example 创建)
// anon key 是公开安全的(Supabase 设计如此,写权限由数据库 RLS 策略限制)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // 防御:没配 .env 时不报错不白屏,只警告;第 3 步起页面才会真正用到
  console.warn('[xinghe-helper] 还没配置 web/.env,数据库连接暂不可用')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Day 8|mock 开关:.env 里 VITE_USE_MOCK=true(或没配数据库)时,页面一律用本地假数据
export const useMockData = !supabase || import.meta.env.VITE_USE_MOCK === 'true'
