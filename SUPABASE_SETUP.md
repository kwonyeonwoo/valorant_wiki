# Supabase 연동 가이드

## 1. 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속 → 무료 계정 생성
2. **New Project** 클릭 → 프로젝트명 입력 (예: `valowiki`)
3. 리전: `Northeast Asia (Seoul)` 권장
4. DB 비밀번호 설정 후 **Create new project** 클릭 (약 1~2분 소요)

---

## 2. 테이블 생성

프로젝트 생성 완료 후, 왼쪽 메뉴 **SQL Editor** → **New query** 실행:

```sql
create table articles (
  id          uuid primary key default gen_random_uuid(),
  title       text unique not null,
  category    text not null check (category in ('일반', '요원')),
  content     text not null default '',
  updated_at  timestamptz not null default now(),
  agent_data  jsonb
);

-- 누구나 읽고 쓸 수 있도록 RLS 정책 설정 (개인 프로젝트용)
alter table articles enable row level security;

create policy "public read" on articles for select using (true);
create policy "public write" on articles for insert with check (true);
create policy "public update" on articles for update using (true);
create policy "public delete" on articles for delete using (true);
```

> **주의**: 위 정책은 누구나 읽기/쓰기가 가능합니다.  
> 인증(Auth)을 추가하려면 나중에 정책을 수정하세요.

---

## 3. 환경 변수 설정

왼쪽 메뉴 **Project Settings** → **API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

프로젝트 루트에 `.env.local` 파일 생성:

```
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 4. 개발 서버 재시작

```powershell
npm run dev
```

앱이 처음 Supabase에 연결되면 로컬 localStorage 데이터를 자동으로 DB에 업로드합니다.  
네비게이션 바에서 🟡 → 🟢 로 바뀌면 연결 성공입니다.

---

## 동작 방식

| 상황 | 동작 |
|------|------|
| 앱 시작 (DB 연결 없음) | localStorage 데이터로 동작 |
| 앱 시작 (DB 연결 있음) | DB 데이터를 불러와 localStorage와 동기화 |
| DB가 비어 있음 | 현재 로컬 데이터를 DB에 자동 업로드(시딩) |
| 요원 저장/삭제 | localStorage + DB 동시 저장 |
| 이미지 (data URL) | DB에는 저장하지 않고 로컬에만 유지 |
