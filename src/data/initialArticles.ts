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

export interface Article {
  title: string;
  category: '일반' | '요원';
  content: string;
  updatedAt: string;
  agentData?: AgentData;
}

export const initialArticles: Record<string, Article> = {
  "대문": {
    title: "대문",
    category: "일반",
    updatedAt: "2026-05-21T11:00:00Z",
    content: `# 발로란트 창작 캐릭터 위키 (ValoWiki)에 오신 것을 환영합니다!

이곳은 **발로란트(VALORANT)** 세계관을 기반으로 유저들이 설계한 독창적인 **창작 요원(Agent)**들을 나무위키 스타일로 정리하고 공유하는 크리에이티브 공간입니다.

직접 기발한 요원을 창작하여 등록하고, 기존 요원들의 밸런스 패치나 스토리를 자유롭게 편집하며 함께 발전시켜 보세요! 모든 문서의 편집 기록은 기록으로 보존되며 언제든 되돌릴 수 있습니다.

---

## 🛠️ 위키 이용 방법
1. **요원 생성 마법사**: 상단 메뉴의 **[요원 생성]** 버튼을 눌러 마법사의 안내에 따라 요원의 국적, 배경, C/Q/E/X 스킬을 차례대로 입력해 보세요. 아주 쉽게 고품질의 위키 요원 문서가 자동 생성됩니다.
2. **나무위키식 문서 링크**: 문서 내에 \`[[문서명]]\`을 입력하면 다른 위키 문서로 바로 가는 링크가 만들어집니다. 예를 들어 아직 작성되지 않은 [[새로운 요원]]을 본문에 적으면 빨간색 링크로 표시되며, 클릭 시 바로 문서를 작성할 수 있습니다.
3. **편집 및 복구**: 상단 우측의 **[편집]** 버튼을 통해 언제든 자유롭게 수정할 수 있으며, 편집이 잘못된 경우 **[역사]** 버튼을 눌러 과거 버전을 확인하고 간편하게 **[되돌리기]**를 실행할 수 있습니다.

---

## 📢 위키 기본 편집 규칙
* 무분별한 비방이나 지나치게 사기적인 스킬 셋은 지양해 주세요. (타 요원들과의 밸런스 유지 요망)
* 다른 창작자가 만든 문서의 무단 삭제는 삼가 바라며, 편집 역사 코멘트에 수정 이유를 자세히 적어주세요.`
  },
};
