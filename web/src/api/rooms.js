// F2 分房工作台的数据层:房间 CRUD、分配落库、AI 历史快照
// Day 8|mock:开关打开(VITE_USE_MOCK=true)或没配 .env 时,读取自动走本地假数据
import { supabase, useMockData } from './client.js'
import { fetchMockData } from './mockData.js'

export async function loadWorkbenchData() {
  if (useMockData) {
    const { students, rooms } = await fetchMockData()
    return { students, rooms, isMock: true }
  }
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

// 写操作的 mock 防御:演示模式下明确说"不可用",不白屏不假成功
function noWrite() {
  if (useMockData) throw new Error('现在是演示数据模式(mock),保存类操作第 3 周接入真实 API 后开放')
}

export async function addRoom(roomNo, capacity) {
  noWrite()
  const { error } = await supabase
    .from('rooms')
    .insert({ camp_id: 1, room_no: roomNo, capacity })
  if (error) throw new Error('建房间失败:' + error.message)
}

export async function updateRoom(roomId, patch) {
  noWrite()
  const { error } = await supabase.from('rooms').update(patch).eq('id', roomId)
  if (error) throw new Error('改房间失败:' + error.message)
}

// 删房间:先把里面的成员放回未分配,再删房(成员的落库动作由调用方在删之前完成)
export async function unassignStudentsOfRoom(roomId) {
  noWrite()
  const { error } = await supabase
    .from('students')
    .update({ assigned_room_id: null, assign_status: '未分配' })
    .eq('assigned_room_id', roomId)
  if (error) throw new Error('成员放回未分配失败:' + error.message)
}

export async function deleteRoom(roomId) {
  noWrite()
  const { error } = await supabase.from('rooms').delete().eq('id', roomId)
  if (error) throw new Error('删房间失败:' + error.message)
}

// 单个学生的分配/取消分配(手动拖拽即时保存)
export async function setStudentRoom(studentId, roomId) {
  noWrite()
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
  noWrite()
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
  noWrite()
  const { error } = await supabase
    .from('assignment_history')
    .insert({ camp_id: 1, run_type: 'ai', snapshot })
  if (error) throw new Error('保存历史失败:' + error.message)
}

// 取最近一次 AI 快照
export async function latestAiSnapshot() {
  noWrite()
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
