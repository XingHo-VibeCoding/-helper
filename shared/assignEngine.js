// xinghe-helper 分房引擎(纯函数,无副作用,前后端通用)
// 规则优先级(对应 PRD 第三节,从高到低):
//   1.【红线】男女不混住 —— 绝不违反,违反直接跳过该房
//   2. 同老师同班优先 —— 同老师的学生尽量聚在一起,同班更优先
//   3. 拼房意愿 —— 学生想要的 1~6 人间尽量满足(且不超房间容量)
//   4. 睡眠相容 —— 打呼噜者之间优先同住;睡眠质量"差"者绝不与打呼噜者同房
// 兜底:分不进的留 unassigned 并标注原因,绝不硬塞
//
// students: [{ id, name, gender:'男'|'女', teacher, class_level, room_pref:1~6,
//              snore:bool|null, sleep_quality:'好'|'一般'|'差'|null }]
// rooms:    [{ id, room_no, capacity }]
// 返回: { assignments:[{student_id, room_id}], unassigned:[{id, name, reason}] }

function rankKey(s) {
  // 同性别 → 同老师 → 同班 排在一起;zh 排序保证星一/星二/星三有序
  return `${s.gender}|${s.teacher}|${s.class_level}`
}

export function runAssignment(students, rooms) {
  // 房间运行时状态:成员、性别占用、睡眠冲突标记
  const state = new Map(
    rooms.map((r) => [
      r.id,
      { ...r, members: [], gender: null, hasSnorer: false, hasLightSleeper: false },
    ]),
  )

  const sorted = [...students].sort((a, b) => rankKey(a).localeCompare(rankKey(b), 'zh'))
  const assignments = []
  const unassigned = []

  for (const s of sorted) {
    // ---- 1. 红线 + 睡眠相容:先筛出"允许进"的房 ----
    const candidates = []
    for (const r of state.values()) {
      if (r.members.length >= r.capacity) continue // 超员:不行
      if (r.gender && r.gender !== s.gender) continue // 红线:混住不行
      if (s.snore && r.hasLightSleeper) continue // 打呼者不进有"睡眠差"的房
      if (s.sleep_quality === '差' && r.hasSnorer) continue // "睡眠差"不进有打呼者的房
      candidates.push(r)
    }

    if (candidates.length === 0) {
      unassigned.push({
        id: s.id,
        name: s.name,
        reason:
          s.sleep_quality === '差' || s.snore
            ? '睡眠冲突无法安排,需调整房间'
            : s.gender === '男'
              ? '需增加男生房间'
              : '需增加女生房间',
      })
      continue
    }

    // ---- 2/3. 给每个候选房打分:同老师同班 > 拼房意愿 ----
    let best = null
    let bestScore = -Infinity
    for (const r of candidates) {
      let score = 0
      if (r.members.some((m) => m.teacher === s.teacher)) score += 40
      if (r.members.some((m) => m.class_level === s.class_level)) score += 20
      if (r.members.length && r.members[0].teacher === s.teacher) score += 10
      // 拼房意愿:房间容量等于意愿、或进住后人数恰达意愿,加分
      if (r.capacity === s.room_pref) score += 8
      if (r.members.length + 1 === s.room_pref) score += 4
      // 少浪费:优先填小房,远离意愿人数的房轻微降分
      score += (6 - r.capacity) * 0.1
      score -= Math.abs(s.room_pref - (r.members.length + 1)) * 0.5
      if (score > bestScore) {
        bestScore = score
        best = r
      }
    }

    // ---- 4. 落位并更新房间状态 ----
    best.members.push(s)
    if (!best.gender) best.gender = s.gender
    if (s.snore) best.hasSnorer = true
    if (s.sleep_quality === '差') best.hasLightSleeper = true
    assignments.push({ student_id: s.id, room_id: best.id })
  }

  return { assignments, unassigned }
}
