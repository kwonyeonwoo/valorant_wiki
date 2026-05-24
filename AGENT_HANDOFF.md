# Valorant Wiki Agent Handoff

> 목적: 이 파일은 사람용 README가 아니라, 후속 에이전트가 이 프로젝트의 맥락을 빠르게 복구하기 위한 작업 기록/상태 문서다.

---

## 현재 상태 요약

- 프로젝트 위치: `C:\Users\User\Documents\Valorant_Wiki`
- 프레임워크: React + TypeScript + Vite
- 주요 언어/문구: 한국어 UI
- 원격 저장소: `https://github.com/kwonyeonwoo/valorant_wiki.git`
- 현재 로컬 브랜치: `main`
- GitHub에 업로드된 마지막 커밋: `f5853d4 Initial Valorant wiki app`
  - 이후 추가된 변경사항(Supabase 연동, UI 개선, 이 문서 등)은 아직 push되지 않음.
- 마지막으로 확인한 빌드: `npm.cmd run build` — 성공 (`✓ built in ~390ms`)
- 현재 dev server: **포트 5173** (`npm.cmd run dev`)
- **Supabase 연동 완료**: `https://podgseccgaavjaszktin.supabase.co`
  - `.env.local` 파일 존재 (gitignore에 의해 GitHub에 올라가지 않음)
  - 테이블 `articles` 생성 완료
  - 앱 첫 실행 시 로컬 데이터가 자동으로 DB에 업로드(시딩)됨

---

## 복구 스냅샷

사용자가 "디자인 참고 사이트를 보고 개선하기 전에 현재 상태를 저장해달라"고 요청했다.

- 저장된 스냅샷: `.codex_snapshots/pre-animation-design-20260521-234914.zip`
- 절대 경로: `C:\Users\User\Documents\Valorant_Wiki\.codex_snapshots\pre-animation-design-20260521-234914.zip`
- 이 스냅샷은 무거운 애니메이션 개선을 시도하기 직전 상태다.
- 이후 사용자가 "렉 걸리는 것 같으니 이전 상태로 돌려줘"라고 해서 위 스냅샷으로 실제 복구했다.
- `.codex_snapshots/`는 `.gitignore`에 추가되어 GitHub에 올라가지 않는다.

복구 방식 참고:

```powershell
$root = Resolve-Path -LiteralPath 'C:\Users\User\Documents\Valorant_Wiki'
$zip = Join-Path $root '.codex_snapshots\pre-animation-design-20260521-234914.zip'
$temp = Join-Path $root '.codex_snapshots\restore-temp'
if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
New-Item -ItemType Directory -Force -Path $temp | Out-Null
Expand-Archive -LiteralPath $zip -DestinationPath $temp -Force
Get-ChildItem -LiteralPath $temp -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $root -Recurse -Force
}
Remove-Item -LiteralPath $temp -Recurse -Force
```

---

## 사용자 요청 이력

1. `C:\Users\User\.gemini\antigravity\scratch\valorant-custom-wiki` 폴더 내용을 현재 폴더로 복사 후 이어서 작업.
2. 캐릭터 이미지를 올릴 수 있게 해달라고 요청.
3. 요원 편집 시 이미지 첨부/수정 가능하게 변경 요청.
4. 요원 이미지가 페이지 상단에 크게 보이고, 부차 설명은 아래에 뜨게 해달라고 요청.
5. 첨부 예시처럼 상단에 캐릭터 대사가 보이게 해달라고 요청.
6. 캐릭터 설명의 목차 제거, 요원 사진창 가운데 크게 배치 요청.
7. 왼쪽 주요 바로가기/최근 변경 문서 창을 열고 닫을 수 있게 요청.
8. 메뉴 여닫는 버튼이 스크롤해도 같은 위치에 고정되게 요청.
9. 메뉴를 열었을 때 메뉴 요소들이 스크롤하면 위로 올라가는 문제 수정 요청.
10. 스크롤 시 메뉴 요소들도 같이 따라오도록 변경 요청.
11. 캐릭터 시그니처 컬러에 따라 페이지 배경색이 변하게 요청.
12. 삭제 기능 추가 요청.
13. 사이트가 밋밋하니 애니메이션/디자인 개선 요청.
14. 열려 있는 페이지 닫기 요청.
15. 테스트용으로 사이트 열기 요청.
16. 위키에 새 항목 추가 요청:
    - 계약 보상
    - 스킬 이미지/아이콘 기능
    - 타 요원간의 관계
    - 페이드의 협박편지
    - 요원 선택 대사
    - 스킬 사용 시 대사
    - 구매단계 및 라운드 진행 시 대사
    - 특정 요원과의 상호작용 대사
    - 처치 시 대사
17. 스킬 사용 시 대사를 제외한 다른 대사는 나무위키 대사 문서처럼 만들고 싶다고 요청.
18. 페이드의 협박편지는 맨 아래에 배치 요청.
19. 문서가 길어질 것이므로 목차와 번호 shortcut 추가 요청.
20. 목차 shortcut 클릭 시 메인화면으로 나가는 문제 수정 요청.
21. 스킬 사용 시 대사는 첨부 예시처럼 구성하되 중간 큰 이미지는 빼고, 스킬명 옆에 스킬 아이콘을 넣을 수 있게 요청.
22. 플레이 전략 및 운용 가이드는 제거하고 요원 공식 배경만 남겨달라고 요청.
23. 스킬 사용 시 대사가 아직 없다고 지적. 대사 박스가 비어도 보이도록 수정.
24. 애니메이션 참고 사이트 목록을 제공하고 디자인 개선 요청. 단, 작업 전에 현재 상태 저장 요청.
25. 디자인 개선분이 별 차이 없고 렉이 걸리는 것 같다고 하여 저장 상태로 복구 요청.
26. GitHub 저장소 `kwonyeonwoo/valorant_wiki.git`에 현재 프로젝트 업로드 요청.
27. 이 프로젝트에 대한 모든 내용을 에이전트용 md 파일로 정리 요청. 현재 파일이 그 결과물이다.
28. *(신규)* UI/디자인 개선 요청 — 메인 대문, 요원 HUD, 네비/사이드바, 위키 카드 대상.
29. *(신규)* 대문에서 `금주의 추천 요원` 섹션 제거 요청.
30. *(신규)* 사이트를 무료 DB에 연결해달라고 요청 → Supabase 선택.
31. *(신규)* Supabase anon key를 직접 제공 → `.env.local` 생성 및 연동 활성화.
32. *(신규)* AGENT_HANDOFF.md를 최신 상태로 업데이트 요청.

---

## 구현된 주요 기능

### 요원 이미지 업로드/편집

- 생성 마법사와 편집 화면에서 요원 이미지 업로드 가능.
- 이미지는 Data URL로 localStorage에 저장된다.
- **Data URL 이미지는 Supabase에 저장하지 않는다.** (용량 문제 방지)
  - Supabase에서 불러올 때 portrait이 null이면 로컬 Data URL을 유지한다.
  - 기본 이미지(`/glint.png`, `/hazard.png`)는 경로값이므로 Supabase에도 저장됨.
- 관련 파일:
  - `src/utils/imageUpload.ts`
  - `src/components/AgentWizard.tsx`
  - `src/components/WikiEditor.tsx`

### 홈 히어로 배너 (신규)

- `'대문'` 페이지에만 표시되는 전용 히어로 섹션.
- 내용: `VALO`**`WIKI`** 타이틀(그라디언트) + 서브타이틀 + 요원 생성 CTA 버튼.
- 히어로 아래에 기존 위키 카드(대문 문서 본문)가 이어서 표시된다.
- 관련 파일:
  - `src/components/WikiReader.tsx` — `article.title === '대문'` 분기 처리
  - `src/index.css` — `.home-hero`, `.home-hero-title`, `.home-hero-badge` 등

### 요원 상단 HUD 레이아웃

- 요원 HUD 모드에서 상단에 요원 선택 대사 표시.
- 요원 이미지는 중앙 대형 카드로 표시.
- 부차 설명과 프로필 팩트는 이미지 아래쪽/카드 내부에 표시.
- 캐릭터 설명 목차는 제거했고, 대신 요원 상세 HUD 내부 목차를 별도로 구성.
- **목차는 `position: sticky; top: 90px`로 스크롤 시 화면에 고정된다.** (신규)
- 관련 파일:
  - `src/components/AgentHUD.tsx`
  - `src/components/WikiReader.tsx`
  - `src/index.css`

### 사이드바 열기/닫기 & 활성 상태 (일부 신규)

- 왼쪽 위키 메뉴는 열고 닫을 수 있다.
- 닫힘 상태에서 `메뉴` 버튼으로 다시 열 수 있다.
- 버튼은 `position: fixed` 기반으로 스크롤해도 같은 위치에 유지된다.
- **현재 방문 중인 페이지의 사이드바 링크가 강조 표시된다.** (신규)
  - `대문`, `빛샘`, `해저드` 항목에 `activePage` 비교 로직 적용.
  - CSS 클래스: `.recent-change-item.active`
- 관련 파일:
  - `src/components/WikiLayout.tsx`
  - `src/index.css`

### 시그니처 컬러 기반 테마

- `AgentData.signatureColor`에 따라 요원 HUD와 페이지 배경이 바뀐다.
- 색상 RGB 변환 유틸 사용.
- 관련 파일:
  - `src/utils/colorTheme.ts`
  - `src/components/WikiLayout.tsx`
  - `src/components/WikiReader.tsx`
  - `src/index.css`

### 문서 삭제 기능

- 읽기 화면에서 삭제 버튼 제공.
- 삭제 시 확인창을 띄우며, 삭제 후 대문으로 이동한다.
- **Supabase에서도 동시에 삭제된다.** (신규)
- 관련 파일:
  - `src/context/WikiContext.tsx`
  - `src/context/WikiContextCore.ts`
  - `src/components/WikiReader.tsx`

### 목차 shortcut

- 요원 HUD 안에 목차가 있다.
- 목차 항목은 `<a href="#...">`가 아니라 `button` + `scrollIntoView`로 작동한다.
- 이유: 해시 기반 라우팅 때문에 `href="#agent-section-..."`를 쓰면 앱이 메인화면/다른 라우트로 나가는 문제가 있었다.
- **목차 박스 자체가 sticky로 화면에 고정된다.** (신규)
- 관련 파일:
  - `src/components/AgentHUD.tsx`
  - `src/index.css`

목차 현재 구성:

1. 개요
2. 계약 보상
3. 스킬
4. 타 요원간의 관계
5. 대사
   - 5.1 요원 선택
   - 5.2 구매단계
   - 5.3 라운드 진행
   - 5.4 특정 요원 상호작용
   - 5.5 처치
6. 요원 공식 배경
7. 페이드의 협박편지

### 계약 보상

- 생성/편집 화면에서 한 줄씩 입력한다.
- 읽기 화면에서는 `2. 계약 보상` 카드에 표시된다.
- 관련 데이터: `AgentData.contractRewards?: string[]`

### 타 요원간의 관계

- 입력 형식: `요원명 | 관계 설명`
- 예: `브림스톤 | 현장 판단을 신뢰한다.`
- 읽기 화면에서 요원명/설명을 분리해 표시한다.
- 관련 데이터:
  - `Relationship`
  - `AgentData.relationships?: Relationship[]`
- 변환 유틸:
  - `src/utils/agentText.ts`

### 페이드의 협박편지

- 입력 가능 항목: 이미지, 편지 내용, 콜사인, 이름, 분류
- 읽기 화면에서는 문서 맨 아래 `7. 페이드의 협박편지`에 표시된다.
- 기존 요원 데이터에 없으면 fallback으로 요원 이미지를 쓰고 "아직 작성된..." 문구 표시.
- 관련 데이터:
  - `FadeLetter`
  - `AgentData.fadeLetter?: FadeLetter`

### 대사 구조

스킬 사용 시 대사를 제외한 대사는 별도 `5. 대사` 섹션에 표시된다.

- 요원 선택 대사: `AgentData.quote`
- 구매단계 대사: `AgentData.buyPhaseQuotes`
- 라운드 진행 시 대사: `AgentData.roundQuotes`
- 특정 요원과의 상호작용 대사: `AgentData.interactionQuotes`
- 처치 시 대사: `AgentData.killQuotes`

입력 형식:

```text
상황 | 대사
상대 요원 | 대사
```

표시 로직:

- `|`가 있으면 왼쪽 라벨과 오른쪽 대사로 나누어 보여준다.
- `|`가 없으면 전체 줄을 대사 본문으로 보여준다.
- 관련 함수: `parseDialogueLine` in `src/components/AgentHUD.tsx`

### 스킬 사용 시 대사

- 스킬별 `Ability.voiceLines?: string[]`에 저장된다.
- 생성/편집 화면에서 스킬별로 입력 가능.
- 스킬 카드 클릭 → 상세 카드 아래 `[ 대사 모음 ]` 박스 항상 표시.
- 비어 있으면 `아직 작성된 항목이 없습니다.` 표시.
- 관련 파일:
  - `src/components/AgentHUD.tsx`
  - `src/components/AgentWizard.tsx`
  - `src/components/WikiEditor.tsx`

### 스킬 아이콘

- `Ability.image`는 큰 미디어가 아니라 **아이콘** 용도다.
- 표시 위치: 스킬 목록 카드의 스킬명 옆, 선택된 스킬 상세 카드 왼쪽
- 관련 CSS: `.ability-hud-icon`, `.ability-use-icon`, `.ability-use-card`

### Supabase DB 연동 (신규)

- 패키지: `@supabase/supabase-js`
- 프로젝트 URL: `https://podgseccgaavjaszktin.supabase.co`
- 테이블: `articles` (title, category, content, updated_at, agent_data JSONB)
- RLS 정책: 인증 없이 누구나 읽기/쓰기/삭제 가능 (개인 프로젝트 설정)
- 동작 방식:
  1. 앱 시작 → localStorage 데이터로 즉시 렌더 (빠른 초기 로드)
  2. 비동기로 Supabase에서 전체 데이터 fetch
  3. DB가 비어 있으면 로컬 데이터를 자동 업로드(시딩)
  4. DB에 데이터가 있으면 로컬 상태와 localStorage를 DB 데이터로 덮어씀
  5. 저장/삭제 시 localStorage + Supabase 동시 반영 (fire-and-forget)
- 네비바에 DB 연결 상태 인디케이터 표시:
  - 🟡 노란 점: 연결 중 (`initializing`)
  - 🟢 초록 점: 연결됨 (`connected`)
  - 회색 점: 오프라인 / 키 미설정 (`offline`)
- 관련 파일:
  - `src/lib/supabase.ts` — 클라이언트 초기화
  - `src/lib/supabaseApi.ts` — fetchAllArticles / upsertArticle / removeArticle
  - `src/context/WikiContext.tsx` — 동기화 로직
  - `src/context/WikiContextCore.ts` — `DbStatus` 타입 추가

### UI 개선 (신규 — 2026-05-24)

렉을 유발하지 않도록 JS 애니메이션 없이 CSS만으로 개선했다.

- **위키 카드 좌측 강조선**: 100px 고정 → 카드 전체 높이 그라디언트 페이드아웃으로 변경
- **스킬 카드 선택 상태**: 외부 glow + inset border 조합으로 강화
- **목차 sticky**: `position: sticky; top: 90px` 적용
- **섹션 배경**: 좌측 accent에서 오른쪽으로 페이드되는 그라디언트 배경 추가
- **사이드바 활성 링크**: `.recent-change-item.active` CSS 클래스 추가
- **대화 아이템 hover**: 밝기 상승 + border 색상 전환 효과
- **DB 상태 인디케이터**: 네비바 우측에 Database 아이콘 + 컬러 도트 추가

---

## 데이터 모델

파일: `src/data/initialArticles.ts`

주요 타입:

```ts
export interface Ability {
  key: 'C' | 'Q' | 'E' | 'X';
  name: string;
  type: string;
  cost: string;
  charges: string;
  description: string;
  image?: string;
  voiceLines?: string[];
}

export interface Relationship {
  agent: string;
  description: string;
}

export interface FadeLetter {
  image: string;
  content: string;
  callsign: string;
  name: string;
  classification: string;
}

export interface AgentData {
  codename: string;
  nameKr: string;
  role: '전략가' | '감시자' | '타격대' | '척후병';
  nationality: string;
  bio: string;
  portrait: string;
  quote?: string;
  signatureColor?: string;
  abilities: Ability[];
  lore: string;
  tips: string[];
  contractRewards?: string[];
  relationships?: Relationship[];
  fadeLetter?: FadeLetter;
  buyPhaseQuotes?: string[];
  roundQuotes?: string[];
  interactionQuotes?: string[];
  killQuotes?: string[];
}
```

주의:

- `tips`는 타입과 생성 마법사에 남아 있지만 HUD 읽기 화면에는 표시하지 않는다.
- `대문` 문서에서 `금주의 추천 창작 요원` 섹션이 제거됐다. localStorage에 구 버전이 남아 있는 경우 `loadWikiState`에서 자동 마이그레이션한다.

---

## 상태 관리

파일:

- `src/context/WikiContext.tsx`
- `src/context/WikiContextCore.ts`
- `src/context/useWiki.ts`

동작 (업데이트):

- 문서 데이터는 **React state + localStorage + Supabase** 3중 구조로 관리된다.
- localStorage 키:
  - `valowiki_articles`
  - `valowiki_history`
- 앱 시작 시 localStorage로 즉시 렌더 후, Supabase에서 비동기 동기화.
- 저장/삭제는 localStorage와 Supabase에 동시에 반영.
- Supabase 키가 없거나 연결 실패 시 localStorage 단독으로 동작 (오프라인 모드).
- Context 타입에 `dbStatus: DbStatus` 추가 (`'initializing' | 'connected' | 'offline'`).
- `signatureColor`는 저장 데이터에 없으면 초기 데이터 또는 `#ff4655`로 보정.

마이그레이션 로직 (`loadWikiState` 내):

1. `quote` 필드 없으면 initialArticles에서 보정.
2. `signatureColor` 없으면 초기값 또는 `#ff4655`로 보정.
3. `대문` 본문에 `금주의 추천 창작 요원` 텍스트가 있으면 initialArticles의 최신 대문 내용으로 교체.

---

## 환경 변수

파일: `.env.local` (gitignore — **절대 커밋하지 말 것**)

```
VITE_SUPABASE_URL=https://podgseccgaavjaszktin.supabase.co
VITE_SUPABASE_ANON_KEY=<실제 키는 사용자에게 요청>
```

- 키가 없으면 Supabase 없이 localStorage 전용으로 동작.
- `.env.example`에 빈 템플릿이 있다.
- Supabase 설정 전체 가이드: `SUPABASE_SETUP.md`

---

## 파일 지도

### 핵심 컴포넌트

- `src/components/WikiLayout.tsx`
  - 상단 네비게이션, 검색, 랜덤 문서, 요원 생성 버튼
  - 사이드바 열기/닫기 + **활성 페이지 하이라이트**
  - 최근 변경 문서
  - 활성 요원 시그니처 컬러를 CSS 변수로 전달
  - **DB 상태 인디케이터** (네비바 우측)

- `src/components/WikiReader.tsx`
  - **`대문` 페이지: 히어로 배너 + 위키 카드** (신규 분기)
  - 일반 위키 문서 렌더링 (Namuwiki 스타일)
  - 요원 HUD 모드 토글
  - 편집/역사/삭제 버튼

- `src/components/AgentHUD.tsx`
  - 요원 전용 HUD 페이지
  - 요원 카드, **sticky 목차**, 계약 보상, 스킬, 관계, 대사, 공식 배경, 페이드 협박편지
  - 목차 버튼 scrollIntoView 처리

- `src/components/AgentWizard.tsx`
  - 신규 요원 생성 마법사
  - 이미지/시그니처 컬러/스킬/계약 보상/관계/편지/대사 입력

- `src/components/WikiEditor.tsx`
  - 기존 문서/요원 편집
  - 요원 프로필 이미지 수정/삭제
  - 스킬 아이콘/스킬 사용 대사 편집
  - 계약 보상, 관계, 페이드 편지, 대사 필드 편집

- `src/components/WikiHistory.tsx`
  - 편집 이력 표시 및 되돌리기

### DB / 데이터 레이어 (신규)

- `src/lib/supabase.ts`
  - Supabase 클라이언트 초기화
  - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 없으면 `null` 반환
  - `isSupabaseReady()` 헬퍼 export

- `src/lib/supabaseApi.ts`
  - `fetchAllArticles()` — 전체 문서 fetch → `Record<string, Article>`
  - `upsertArticle(article)` — title 기준 upsert
  - `removeArticle(title)` — 삭제

### 유틸

- `src/utils/imageUpload.ts` — 업로드 파일을 Data URL로 변환, MIME/크기 검증
- `src/utils/colorTheme.ts` — HEX → RGB 문자열 변환
- `src/utils/agentText.ts` — textarea ↔ string array, 관계 텍스트 ↔ `Relationship[]`

### 스타일

- `src/index.css`
  - 대부분의 UI/레이아웃/애니메이션 스타일
  - 요원 HUD, 사이드바, 목차, 대사 섹션, 페이드 편지, 스킬 카드 포함
  - **신규**: `.home-hero` 관련 클래스, `.recent-change-item.active`, `.db-status-badge`, `.db-status-dot`, `@keyframes dbPulse`

### 설정/문서

- `.env.local` — Supabase 실제 키 (gitignore)
- `.env.example` — 빈 키 템플릿
- `SUPABASE_SETUP.md` — Supabase 프로젝트 생성부터 테이블 생성까지 단계별 가이드
- `AGENT_HANDOFF.md` — 이 파일

---

## 제거/복구된 디자인 실험

사용자가 제공한 참고 파일:

- `C:\Users\User\Downloads\애니메이션_명작_웹사이트_10선.md`

시도했던 무거운 개선(복구됨):

- 마우스 위치 반응형 배경 조명
- 스캔라인/그리드 모션 강화
- 키네틱 로고 텍스트
- 버튼/카드 호버 강화
- HUD 툴바/목차 진입 애니메이션
- 모션 감소 설정 대응

사용자 피드백: "별 차이는 없는데 렉이 걸리는 것 같다" → 스냅샷으로 복구.

이후 재시도(2026-05-24, 현재 코드에 포함됨):

- JS 애니메이션 없이 CSS 전환/그라디언트만 사용
- `will-change`, `requestAnimationFrame`, Intersection Observer 미사용
- GPU 가속 `transform` + `opacity`만 활용
- 현재 이 개선분은 코드에 적용되어 있음

---

## Git/GitHub 작업 이력

- 요청 저장소: `https://github.com/kwonyeonwoo/valorant_wiki.git`
- 마지막 push 커밋: `f5853d4 Initial Valorant wiki app`
- **이후 변경 사항은 아직 push되지 않음.**

다음 push 시 포함될 내용:

- `AGENT_HANDOFF.md` (이 파일)
- `SUPABASE_SETUP.md`
- `.env.example`
- `src/lib/supabase.ts`
- `src/lib/supabaseApi.ts`
- 수정된 Context, WikiLayout, WikiReader, AgentHUD, index.css 등

push 명령:

```powershell
git add -A
git commit -m "Add Supabase integration and UI improvements"
git push
```

주의: `.env.local`은 `*.local` gitignore 규칙으로 자동 제외되므로 push해도 키가 올라가지 않는다.

---

## 검증 명령

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run dev     # http://127.0.0.1:5173
```

요원 예시 페이지:

```
http://127.0.0.1:5173/#/wiki/빛샘
```

---

## 중요 설계/주의점

### 목차 링크는 일반 anchor href로 바꾸면 안 됨

이 앱은 해시 기반 라우팅을 사용한다. `href="#agent-section-5"` 같은 링크는 라우터 hash를 바꿔 메인화면으로 나가는 문제를 일으킨다.

현재 방식:

```ts
document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

### 스킬 `image`는 현재 "아이콘"이다

`Ability.image`를 큰 미디어로 다시 렌더링하지 말 것. 스킬명 옆의 소형 아이콘 용도로만 사용.

### 스킬 사용 시 대사 박스는 항상 보여야 함

`selectedAbility.voiceLines`가 없어도 `[ 대사 모음 ]` 박스를 항상 표시하고 빈 상태 문구를 보여준다.

### 플레이 전략/운용 가이드는 표시하지 말 것

`tips`는 데이터 모델/마법사에 남아 있지만 읽기 화면에는 표시하지 않는다.

### 복구 스냅샷은 GitHub에 올리지 말 것

`.codex_snapshots/`는 `.gitignore`에 포함되어 있다.

### 이미지 저장 방식

업로드 이미지는 Data URL로 localStorage에 저장된다. Supabase에는 저장하지 않는다.

- Supabase 동기화 시 portrait이 null이면 로컬 Data URL을 보존한다.
- 큰 이미지가 많아지면 localStorage 용량(약 5MB) 문제가 생길 수 있다.

### Supabase RLS 정책은 공개 읽기/쓰기 상태다

현재는 인증 없이 누구나 데이터를 읽고 수정할 수 있다. 공개 배포 시 Auth 추가 및 정책 강화 필요.

### Supabase 오프라인 fallback

`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 환경변수가 없으면 Supabase 클라이언트가 `null`이 되고, localStorage 전용 모드로 정상 동작한다.

---

## 현재 알려진 미정리 항목

- `tips` 입력 필드가 마법사에 남아 있지만 HUD에는 표시되지 않는다. 완전 제거 시 `AgentWizard`, 초기 데이터, 타입 정리 필요.
- 일반 위키 텍스트 파서가 정규식 기반이라 복잡한 나무위키 문법은 제한적이다.
- **GitHub에 최신 변경사항이 push되지 않았다.** (Supabase 연동, UI 개선, 이 문서 포함)
- Supabase RLS 정책이 공개 상태 — 공개 배포 전 인증 추가 권장.
- 업로드 이미지(Data URL)는 Supabase에 저장되지 않아 다른 기기에서 접속 시 portrait이 비어 있을 수 있다.
