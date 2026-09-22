-- xinghe-helper 第 1 段:建表 + 种子数据(对应 TECH_DESIGN.md 第三节)
-- 在 Supabase SQL Editor 中单独执行;成功后再执行 0002_policies.sql
-- 顺序说明:先建 rooms 再建 students(students 要引用 rooms.id)

-- ===== 1. 营期(MVP 只 seed 一行 id=1;P2 多营期启用)=====
create table camps (
  id       bigserial primary key,
  name     varchar(100) not null,
  org_name varchar(100),
  created_at timestamptz default now()
);

-- ===== 2. 房间(先建,供 students 引用)=====
create table rooms (
  id           bigserial primary key,
  camp_id      bigint not null default 1 references camps(id),
  room_no      varchar(20) not null,
  capacity     int not null check (capacity > 0),
  gender_label varchar(2) check (gender_label in ('男','女')),
  created_at   timestamptz default now(),
  unique (camp_id, room_no)
);

-- ===== 3. 学生 =====
create table students (
  id               bigserial primary key,
  camp_id          bigint not null default 1 references camps(id),
  name             varchar(50) not null,
  gender           varchar(2) not null check (gender in ('男','女')),
  teacher          varchar(20) not null
                     check (teacher in ('Mona','Kiven','Selena','Betty','Priya')),
  class_level      varchar(10) not null check (class_level in ('星一','星二','星三')),
  check_in_date    date not null,
  room_pref        int not null check (room_pref between 1 and 6),
  snore            boolean,
  sleep_quality    varchar(10) check (sleep_quality in ('好','一般','差')),
  note             text,
  is_latest        boolean not null default true,
  superseded_by    bigint,
  assigned_room_id bigint references rooms(id),
  assign_status    varchar(10) not null default '未分配'
                     check (assign_status in ('未分配','已分配')),
  created_at       timestamptz default now()
);

create index idx_students_unassigned
  on students(camp_id, assign_status, gender)
  where assigned_room_id is null;

-- ===== 4. 分房历史快照 =====
create table assignment_history (
  id         bigserial primary key,
  camp_id    bigint not null default 1,
  run_type   varchar(10) not null check (run_type in ('ai','manual')),
  snapshot   jsonb not null,
  created_at timestamptz default now()
);

-- ===== 5. 种子数据:MVP 唯一营期 =====
insert into camps (id, name) values (1, '第一期口语拉练营');
select setval('camps_id_seq', 1, true);
