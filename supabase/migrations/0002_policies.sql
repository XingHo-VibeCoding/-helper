-- xinghe-helper 第 2 段:行级安全 RLS(MVP 简化策略)
-- 必须在 0001_schema.sql 成功之后执行
-- 策略名用英文,避开 Supabase SQL Editor 对中文标识符的处理问题
-- 学生表不给 delete:PRD 要求留痕、不物理删除

alter table camps enable row level security;
alter table students enable row level security;
alter table rooms enable row level security;
alter table assignment_history enable row level security;

create policy camps_public_read on camps
  for select using (true);

create policy students_public_read on students
  for select using (true);
create policy students_public_insert on students
  for insert with check (true);
create policy students_public_update on students
  for update using (true) with check (true);

create policy rooms_public_read on rooms
  for select using (true);
create policy rooms_public_insert on rooms
  for insert with check (true);
create policy rooms_public_update on rooms
  for update using (true) with check (true);
create policy rooms_public_delete on rooms
  for delete using (true);

create policy history_public_read on assignment_history
  for select using (true);
create policy history_public_insert on assignment_history
  for insert with check (true);
