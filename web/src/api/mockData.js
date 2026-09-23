// Day 8|mock 数据层:本地假数据,字段与真实数据库表完全一致
// 真实 API 第 3 周才接;现在没配 .env 时,页面自动用这里的数据渲染
// 错误态演示:浏览器地址栏加 ?mockError=1 再刷新,loadWorkbenchData 会假装请求失败

const MOCK_ROOMS = [
  { id: 101, camp_id: 1, room_no: '301', capacity: 4, gender_label: '女', created_at: null },
  { id: 102, camp_id: 1, room_no: '302', capacity: 4, gender_label: '男', created_at: null },
  { id: 103, camp_id: 1, room_no: '303', capacity: 3, gender_label: '女', created_at: null },
  { id: 104, camp_id: 1, room_no: '304', capacity: 6, gender_label: null, created_at: null },
]

const MOCK_STUDENTS = [
  // —— 已分配的 9 人 ——
  { id: 1, camp_id: 1, name: '林小满', gender: '女', teacher: 'Mona', class_level: '星一', check_in_date: '2027-01-20', room_pref: 4, snore: false, sleep_quality: '好', note: null, is_latest: true, superseded_by: null, assigned_room_id: 101, assign_status: '已分配', created_at: null },
  { id: 2, camp_id: 1, name: '陈知夏', gender: '女', teacher: 'Mona', class_level: '星一', check_in_date: '2027-01-20', room_pref: 4, snore: true, sleep_quality: '一般', note: '轻度打呼,自己知道', is_latest: true, superseded_by: null, assigned_room_id: 101, assign_status: '已分配', created_at: null },
  { id: 3, camp_id: 1, name: '王一诺', gender: '女', teacher: 'Mona', class_level: '星二', check_in_date: '2027-01-21', room_pref: 4, snore: false, sleep_quality: '差', note: null, is_latest: true, superseded_by: null, assigned_room_id: 101, assign_status: '已分配', created_at: null },
  { id: 4, camp_id: 1, name: '苏晚晴', gender: '女', teacher: 'Selena', class_level: '星三', check_in_date: '2027-01-20', room_pref: 3, snore: false, sleep_quality: '好', note: null, is_latest: true, superseded_by: null, assigned_room_id: 103, assign_status: '已分配', created_at: null },
  { id: 5, camp_id: 1, name: '周砚', gender: '女', teacher: 'Selena', class_level: '星三', check_in_date: '2027-01-20', room_pref: 3, snore: false, sleep_quality: '一般', note: null, is_latest: true, superseded_by: null, assigned_room_id: 103, assign_status: '已分配', created_at: null },
  { id: 6, camp_id: 1, name: '赵子昂', gender: '男', teacher: 'Kiven', class_level: '星一', check_in_date: '2027-01-20', room_pref: 4, snore: true, sleep_quality: '好', note: null, is_latest: true, superseded_by: null, assigned_room_id: 102, assign_status: '已分配', created_at: null },
  { id: 7, camp_id: 1, name: '李昊然', gender: '男', teacher: 'Kiven', class_level: '星一', check_in_date: '2027-01-21', room_pref: 4, snore: false, sleep_quality: '一般', note: null, is_latest: true, superseded_by: null, assigned_room_id: 102, assign_status: '已分配', created_at: null },
  { id: 8, camp_id: 1, name: '孙一飞', gender: '男', teacher: 'Betty', class_level: '星二', check_in_date: '2027-01-20', room_pref: 6, snore: false, sleep_quality: '好', note: '想和赵子昂一间', is_latest: true, superseded_by: null, assigned_room_id: 102, assign_status: '已分配', created_at: null },
  { id: 9, camp_id: 1, name: '何静姝', gender: '女', teacher: 'Priya', class_level: '星二', check_in_date: '2027-01-21', room_pref: 2, snore: false, sleep_quality: '好', note: null, is_latest: true, superseded_by: null, assigned_room_id: 103, assign_status: '已分配', created_at: null },
  // —— 未分配的 3 人(演示"未分配"区)——
  { id: 10, camp_id: 1, name: '郑楚', gender: '男', teacher: 'Betty', class_level: '星三', check_in_date: '2027-01-20', room_pref: 4, snore: false, sleep_quality: '好', note: null, is_latest: true, superseded_by: null, assigned_room_id: null, assign_status: '未分配', created_at: null },
  { id: 11, camp_id: 1, name: '高远', gender: '男', teacher: 'Kiven', class_level: '星二', check_in_date: '2027-01-21', room_pref: 2, snore: true, sleep_quality: '一般', note: null, is_latest: true, superseded_by: null, assigned_room_id: null, assign_status: '未分配', created_at: null },
  { id: 12, camp_id: 1, name: '沈知意', gender: '女', teacher: 'Priya', class_level: '星一', check_in_date: '2027-01-20', room_pref: 3, snore: false, sleep_quality: '差', note: '认床,怕吵', is_latest: true, superseded_by: null, assigned_room_id: null, assign_status: '未分配', created_at: null },
]

// 模拟网络请求:延迟 600ms 返回;地址栏带 ?mockError=1 时抛错(演示错误状态)
export function fetchMockData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (window.location.search.includes('mockError')) {
        reject(new Error('演示用报错:读取学生失败(这只是模拟,别慌)'))
        return
      }
      resolve({ students: MOCK_STUDENTS, rooms: MOCK_ROOMS })
    }, 600)
  })
}
