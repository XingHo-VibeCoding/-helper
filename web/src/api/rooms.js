// F2 分房工作台的数据层:房间 CRUD、分配落库、AI 历史快照
import { supabase } from './client.js'

export async function loadWorkbenchData() {
  if (!supabase) throw new Error('数据库未连接:web/.env 缺失或 dev server 需重启')
  const [studentsRes, roomsRes] = await Promise.all([
    supabase
      .from('students')
      .select('*')
      .eq('camp_id', 1)
      .eq('is_latest', true)
      .order('id'),
    supabase.from('rooms').select('*').eq('camp_id', 1).order('room_no'),
  ])
  if (studentsRes.error) throw new Error('读取学生失败:' + studentsRes.error.message)
  if (roomsRes.error) throw new Error('读取房间失败:' + roomsRes.error.message)
  return { students: studentsRes.data, rooms: roomsRes.data }
}

export async function addRoom(roomNo, capacity) {
  const { error } = await supabase
    .from('rooms')
    .insert({ camp_id: 1, room_no: roomNo, capacity })
  if (error) throw new Error('建房间失败:' + error.message)
}

export async function updateRoom(roomId, patch) {
  const { error } = await supabase.from('rooms').update(patch).eq('id', roomId)
  if (error) throw new Error('改房间失败:' + error.message)
}

// 删房间:先把里面的成员放回未分配,再删房(成员的落库动作由调用方在删之前完成)
export async function unassignStudentsOfRoom(roomId) {
  const { error } = await supabase
    .from('students')
    .update({ assigned_room_id: null, assign_status: '未分配' })
    .eq('assigned_room_id', roomId)
  if (error) throw new Error('成员放回未分配失败:' + error.message)
}

export async function deleteRoom(roomId) {
  const { error } = await supabase.from('rooms').delete().eq('id', roomId)
  if (error) throw new Error('删房间失败:' + error.message)
}

// 单个学生的分配/取消分配(手动拖拽即时保存)
export async function setStudentRoom(studentId, roomId) {
  const { error } = await supabase
    .from('students')
    .update({
      assigned_room_id: roomId,
      assign_status: roomId ? '已分配' : '未分配',
    })
    .eq('id', studentId)
  if (error) throw new Error('保存分配失败:' + error.message)
}

// 批量应用分配方案(AI 分房 / 恢复快照共用):先清空再写入
// assignments: [{student_id, room_id}];onlyStudents 限定生效范围(一键分房=只分未分配的)
export async function applyAssignments(assignments, clearStudentIds) {
  if (clearStudentIds?.length) {
    // 按行更新以精确控制;几十人规模逐条更新完全够用
    for (const id of clearStudentIds) {
      const inPlan = assignments.some((a) => a.student_id === id)
      if (!inPlan) {
        const { error } = await supabase
          .from('students')
          .update({ assigned_room_id: null, assign_status: '未分配' })
          .eq('id', id)
        if (error) throw new Error('清空旧分配失败:' + error.message)
      }
    }
  }
  for (const a of assignments) {
    const { error } = await supabase
      .from('students')
      .update({ assigned_room_id: a.room_id, assign_status: '已分配' })
      .eq('id', a.student_id)
    if (error) throw new Error('写入分配失败:' + error.message)
  }
}

// 保存 AI 方案快照(供"恢复 AI 方案"用)
export async function saveHistorySnapshot(snapshot) {
  const { error } = await supabase
    .from('assignment_history')
    .insert({ camp_id: 1, run_type: 'ai', snapshot })
  if (error) throw new Error('保存历史失败:' + error.message)
}

// 取最近一次 AI 快照
export async function latestAiSnapshot() {
  const { data, error } = await supabase
    .from('assignment_history')
    .select('snapshot, created_at')
    .eq('camp_id', 1)
    .eq('run_type', 'ai')
    .order('created_at', { ascending: false })
    .limit(1)
  if (error) throw new Error('读取历史失败:' + error.message)
  return data[0] ?? null
}
