// F1 学生提交逻辑(对应 PRD 第四节"重复提交保留最新、旧条目失效")
// MVP 简化:去重按"同营期 + 同姓名"匹配,在浏览器端完成(TECH_DESIGN 里的
// Edge Function 方案留到有并发需求时再上,几十人规模无需)
import { supabase } from './client.js'

export async function fetchCampName() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('camps')
    .select('name, org_name')
    .eq('id', 1)
    .single()
  if (error) return null
  return data
}

export async function submitStudent(form) {
  if (!supabase) throw new Error('数据库未连接:web/.env 缺失或 dev server 需重启')

  // 1. 插入新记录
  const { data: inserted, error: insertErr } = await supabase
    .from('students')
    .insert(form)
    .select('id')
    .single()
  if (insertErr) throw new Error('提交失败:' + insertErr.message)
  const newId = inserted.id

  // 2. 把同名旧记录标记失效(保留痕迹,不物理删除)
  const { error: updateErr } = await supabase
    .from('students')
    .update({ is_latest: false, superseded_by: newId })
    .eq('camp_id', 1)
    .eq('name', form.name)
    .eq('is_latest', true)
    .neq('id', newId)
  if (updateErr) throw new Error('旧记录失效标记失败:' + updateErr.message)

  // 3. 查是否有旧记录被翻转 → 决定确认页文案是"已收到"还是"已更新"
  const { count } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('camp_id', 1)
    .eq('name', form.name)
    .eq('is_latest', false)

  return { id: newId, updated: (count ?? 0) > 0 }
}
