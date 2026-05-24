import React, { useState } from 'react';
import { useWiki } from '../context/useWiki';
import { Sparkles, ArrowLeft, ArrowRight, Save, User, Swords, Scroll, ImagePlus } from 'lucide-react';
import type { Ability, AgentData } from '../data/initialArticles';
import { uploadImage } from '../utils/imageUpload';
import { textToLines, textToRelationships } from '../utils/agentText';

type AbilityKey = 'C' | 'Q' | 'E' | 'X';
type AbilityDraft = {
  name: string;
  cost: string;
  charges: string;
  description: string;
  image: string;
  voiceLines: string;
};

const abilityLabels: Record<AbilityKey, string> = {
  C: '기본 전술 능력',
  Q: '기본 전술 능력',
  E: '시그니처 능력',
  X: '궁극기'
};

export const AgentWizard: React.FC = () => {
  const { saveArticle, navigateToPage } = useWiki();

  const [step, setStep] = useState(1);
  const [codename, setCodename] = useState('');
  const [nameKr, setNameKr] = useState('');
  const [role, setRole] = useState<AgentData['role']>('전략가');
  const [nationality, setNationality] = useState('');
  const [bio, setBio] = useState('');
  const [quote, setQuote] = useState('');
  const [signatureColor, setSignatureColor] = useState('#00f0ff');
  const [portrait, setPortrait] = useState('/glint.png');
  const [portraitPreset, setPortraitPreset] = useState('/glint.png');
  const [portraitFileName, setPortraitFileName] = useState('');
  const [portraitError, setPortraitError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [abilityC, setAbilityC] = useState<AbilityDraft>({ name: '', cost: '100 크레드', charges: '2개', description: '', image: '', voiceLines: '' });
  const [abilityQ, setAbilityQ] = useState<AbilityDraft>({ name: '', cost: '200 크레드', charges: '2개', description: '', image: '', voiceLines: '' });
  const [abilityE, setAbilityE] = useState<AbilityDraft>({ name: '', cost: '무료 (35초 재충전)', charges: '1개 (재충전 가능)', description: '', image: '', voiceLines: '' });
  const [abilityX, setAbilityX] = useState<AbilityDraft>({ name: '', cost: '궁극기 포인트 8개', charges: '1개', description: '', image: '', voiceLines: '' });

  const [lore, setLore] = useState('');
  const [tip1, setTip1] = useState('');
  const [tip2, setTip2] = useState('');
  const [tip3, setTip3] = useState('');
  const [contractRewards, setContractRewards] = useState('');
  const [relationships, setRelationships] = useState('');
  const [fadeLetterImage, setFadeLetterImage] = useState('/glint.png');
  const [fadeLetterContent, setFadeLetterContent] = useState('');
  const [fadeLetterCallsign, setFadeLetterCallsign] = useState('');
  const [fadeLetterName, setFadeLetterName] = useState('');
  const [fadeLetterClassification, setFadeLetterClassification] = useState('라디언트');
  const [buyPhaseQuotes, setBuyPhaseQuotes] = useState('');
  const [roundQuotes, setRoundQuotes] = useState('');
  const [interactionQuotes, setInteractionQuotes] = useState('');
  const [killQuotes, setKillQuotes] = useState('');

  const abilitySetters = {
    C: setAbilityC,
    Q: setAbilityQ,
    E: setAbilityE,
    X: setAbilityX
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePortraitPresetChange = (value: string) => {
    setPortraitPreset(value);
    setPortrait(value);
    setPortraitFileName('');
    setPortraitError('');
  };

  const handlePortraitUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setPortrait(url);
      setPortraitPreset('custom');
      setPortraitFileName(file.name);
      setPortraitError('');
    } catch (error) {
      setPortraitError(error instanceof Error ? error.message : '이미지를 읽을 수 없습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAbilityImageUpload = async (key: AbilityKey, file?: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      abilitySetters[key](prev => ({ ...prev, image: url }));
    } catch {
      alert('스킬 아이콘 이미지를 읽을 수 없습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFadeLetterImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setIsUploading(true);
    try {
      setFadeLetterImage(await uploadImage(file));
    } catch {
      alert('페이드 협박편지 이미지를 읽을 수 없습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const toAbility = (key: AbilityKey, draft: AbilityDraft): Ability => ({
    key,
    name: draft.name || `${key} 스킬`,
    type: abilityLabels[key],
    cost: draft.cost,
    charges: draft.charges,
    description: draft.description || '상세 설명을 추가해 주세요.',
    image: draft.image,
    voiceLines: textToLines(draft.voiceLines)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!codename || !nameKr) {
      alert('요원 코드네임과 한국어 이름을 반드시 입력해 주세요.');
      setStep(1);
      return;
    }

    const tipsList = [tip1, tip2, tip3].filter(t => t.trim() !== '');
    if (tipsList.length === 0) {
      tipsList.push('아직 등록된 요원 공략 팁이 없습니다. 팁을 추가하여 문서를 더 풍성하게 가꿔보세요.');
    }

    const agentData: AgentData = {
      codename: codename.toUpperCase().trim(),
      nameKr: nameKr.trim(),
      role,
      nationality: nationality.trim() || '정보 없음',
      bio: bio.trim() || '새롭게 요원으로 등록되었습니다.',
      portrait,
      quote: quote.trim() || '내 앞을 막아서는 순간, 전장은 이미 내 것이 됩니다.',
      signatureColor,
      abilities: [
        toAbility('C', abilityC),
        toAbility('Q', abilityQ),
        toAbility('E', abilityE),
        toAbility('X', abilityX)
      ],
      lore: lore.trim() || '요원의 공식 배경 스토리가 아직 추가되지 않았습니다.',
      tips: tipsList,
      contractRewards: textToLines(contractRewards),
      relationships: textToRelationships(relationships),
      fadeLetter: {
        image: fadeLetterImage,
        content: fadeLetterContent.trim() || '아직 해독되지 않은 페이드의 협박편지입니다.',
        callsign: fadeLetterCallsign.trim() || codename.toUpperCase().trim(),
        name: fadeLetterName.trim() || nameKr.trim(),
        classification: fadeLetterClassification.trim() || '라디언트'
      },
      buyPhaseQuotes: textToLines(buyPhaseQuotes),
      roundQuotes: textToLines(roundQuotes),
      interactionQuotes: textToLines(interactionQuotes),
      killQuotes: textToLines(killQuotes)
    };

    const generatedMarkdown = `# 요원 소개: ${nameKr} (${codename.toUpperCase()})

${nationality} 출신의 ${role} 요원 **${nameKr}(${codename.toUpperCase()})**입니다.

${bio}

---

## 주요 특징
* **역할군**: [[전문:${role}]]
* **소속 및 출생지**: ${nationality}
* **코드네임**: ${codename.toUpperCase()}

---

## 스토리 및 배경설정
${lore || '이 요원은 독특한 배경 지식을 지닌 비밀 요원으로 아직 활동 및 발로란트 프로토콜의 상세 내용은 입증되지 않았습니다.'}

---

## 사용 팁
${tipsList.map(tip => `* ${tip}`).join('\n')}
`;

    saveArticle(nameKr.trim(), generatedMarkdown, '요원', '요원 생성 마법사를 통한 신규 요원 등록', agentData);
  };

  const renderAbilityCard = (key: AbilityKey, draft: AbilityDraft) => {
    const setDraft = abilitySetters[key];

    return (
      <div className={`wiki-card ability-draft-card ${key === 'E' ? 'signature' : ''}`}>
        <div className="ability-draft-title">[{key} 스킬] {abilityLabels[key]}</div>
        <div className="ability-draft-fields">
          <input type="text" placeholder="스킬명" value={draft.name} onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))} />
          <div className="ability-draft-row">
            <input type="text" placeholder="비용" value={draft.cost} onChange={(e) => setDraft(prev => ({ ...prev, cost: e.target.value }))} />
            <input type="text" placeholder="소지/재충전" value={draft.charges} onChange={(e) => setDraft(prev => ({ ...prev, charges: e.target.value }))} />
          </div>
          <textarea placeholder="스킬 세부 메커니즘을 상세히 적어주세요." rows={3} value={draft.description} onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))} />
          {draft.image && <img className="ability-image-preview" src={draft.image} alt={`${key} 스킬 아이콘 미리보기`} />}
          <div className="editor-agent-actions">
            <label className="val-btn portrait-upload-button">
              <ImagePlus size={12} /> 스킬 아이콘 첨부
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  handleAbilityImageUpload(key, e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {draft.image && (
              <button type="button" className="val-btn val-btn-danger" onClick={() => setDraft(prev => ({ ...prev, image: '' }))}>
                이미지 삭제
              </button>
            )}
          </div>
          <textarea
            placeholder={'스킬 사용 시 대사를 한 줄에 하나씩 입력하세요.\n예: 방벽 생성. (Making cover!)'}
            rows={4}
            value={draft.voiceLines}
            onChange={(e) => setDraft(prev => ({ ...prev, voiceLines: e.target.value }))}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="wiki-card fade-in">
      <div className="wiki-title-container">
        <h1 className="wiki-title" style={{ gap: '12px' }}>
          <Sparkles size={28} style={{ color: 'var(--color-accent)' }} />
          창작 요원 생성기 (Agent Wizard)
        </h1>
        <button className="val-btn" onClick={() => navigateToPage('대문')}>
          <ArrowLeft size={12} /> 대문으로
        </button>
      </div>

      <div className="wizard-steps-indicator" style={{ marginBottom: '40px' }}>
        <div className={`wizard-step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
        <div className={`wizard-step-node ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <form onSubmit={handleSubmit} className="wizard-form">
        {step === 1 && (
          <div className="fade-in wizard-step-panel">
            <div className="sidebar-title" style={{ fontSize: '16px' }}>
              <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              STEP 1: 요원 핵심정보 입력
            </div>

            <div className="wizard-grid">
              <div className="wizard-field-group">
                <label>한국어 이름 <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                <input type="text" placeholder="예: 빛샘, 소바, 제트" value={nameKr} onChange={(e) => setNameKr(e.target.value)} required />
              </div>
              <div className="wizard-field-group">
                <label>영문 코드네임 <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                <input type="text" placeholder="예: GLINT, SOVA, JETT" value={codename} onChange={(e) => setCodename(e.target.value)} required />
              </div>
            </div>

            <div className="wizard-grid">
              <div className="wizard-field-group">
                <label>역할군</label>
                <select value={role} onChange={(e) => setRole(e.target.value as AgentData['role'])}>
                  <option value="전략가">전략가 (Controller)</option>
                  <option value="감시자">감시자 (Sentinel)</option>
                  <option value="타격대">타격대 (Duelist)</option>
                  <option value="척후병">척후병 (Initiator)</option>
                </select>
              </div>
              <div className="wizard-field-group">
                <label>출신지 / 국적</label>
                <input type="text" placeholder="예: 대한민국 서울, 일본 홋카이도" value={nationality} onChange={(e) => setNationality(e.target.value)} />
              </div>
            </div>

            <div className="wizard-field-group">
              <label>캐릭터 이미지</label>
              <div className="portrait-upload-panel">
                <div className="portrait-upload-preview">
                  <img src={portrait} alt="요원 초상화 미리보기" />
                </div>
                <div className="portrait-upload-controls">
                  <select value={portraitPreset} onChange={(e) => handlePortraitPresetChange(e.target.value)}>
                    <option value="/glint.png">Glint 프리셋</option>
                    <option value="/hazard.png">Hazard 프리셋</option>
                    <option value="custom" disabled>{portraitFileName ? `업로드됨: ${portraitFileName}` : '업로드 이미지'}</option>
                  </select>
                  <label className="val-btn portrait-upload-button">
                    이미지 업로드
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handlePortraitUpload} />
                  </label>
                  {portraitFileName && (
                    <button type="button" className="val-btn" onClick={() => handlePortraitPresetChange('/glint.png')}>
                      기본값으로
                    </button>
                  )}
                  {portraitError && <div className="portrait-upload-error">{portraitError}</div>}
                </div>
              </div>
            </div>

            <div className="wizard-field-group">
              <label>요원 한 줄 설명 (Bio)</label>
              <textarea rows={3} placeholder="요원의 고유 능력과 개성을 설명하는 짧은 소개를 작성해 주세요." value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="wizard-field-group">
              <label>요원 선택 대사</label>
              <input type="text" placeholder="예: 내 앞을 막아서는 순간, 전장은 이미 내 것이 됩니다." value={quote} onChange={(e) => setQuote(e.target.value)} />
            </div>

            <div className="wizard-field-group">
              <label>시그니처 컬러</label>
              <div className="signature-color-row">
                <input type="color" value={signatureColor} onChange={(e) => setSignatureColor(e.target.value)} aria-label="요원 시그니처 컬러" />
                <input type="text" value={signatureColor} onChange={(e) => setSignatureColor(e.target.value)} aria-label="요원 시그니처 컬러 코드" />
                <span className="signature-color-preview" style={{ background: signatureColor }} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in wizard-step-panel">
            <div className="sidebar-title" style={{ fontSize: '16px', color: 'var(--color-teal)', borderBottomColor: 'rgba(0, 240, 255, 0.2)' }}>
              <Swords size={14} style={{ marginRight: '6px', verticalAlign: 'middle', color: 'var(--color-teal)' }} />
              STEP 2: 전술 스킬 셋 (C, Q, E, X) 설정
            </div>
            <div className="ability-editor-grid">
              {renderAbilityCard('C', abilityC)}
              {renderAbilityCard('Q', abilityQ)}
              {renderAbilityCard('E', abilityE)}
              {renderAbilityCard('X', abilityX)}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in wizard-step-panel">
            <div className="sidebar-title" style={{ fontSize: '16px' }}>
              <Scroll size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              STEP 3: 보상, 관계, 편지, 대사 설정
            </div>

            <div className="wizard-field-group">
              <label>요원 상세 스토리 및 탄생 배경</label>
              <textarea rows={5} placeholder="라디언트 각성 계기, 킹덤과의 마찰, 타 요원들과의 친밀도 등 설정을 적어주세요." value={lore} onChange={(e) => setLore(e.target.value)} />
            </div>

            <div className="wizard-field-group">
              <label>계약 보상</label>
              <textarea rows={4} placeholder={'한 줄에 하나씩 입력하세요.\n예: 1티어 - 빛샘 스프레이'} value={contractRewards} onChange={(e) => setContractRewards(e.target.value)} />
            </div>

            <div className="wizard-field-group">
              <label>타 요원간의 관계</label>
              <textarea rows={4} placeholder={'요원명 | 관계 설명 형식으로 한 줄씩 입력하세요.\n예: 브림스톤 | 빛샘의 현장 판단을 신뢰한다.'} value={relationships} onChange={(e) => setRelationships(e.target.value)} />
            </div>

            <div className="fade-letter-editor">
              <div className="sidebar-title" style={{ fontSize: '15px', marginBottom: '0' }}>페이드의 협박편지</div>
              <div className="fade-letter-editor-grid">
                <div>
                  <div className="portrait-upload-preview fade-letter-preview">
                    <img src={fadeLetterImage} alt="페이드 협박편지 이미지 미리보기" />
                  </div>
                  <label className="val-btn portrait-upload-button">
                    편지 이미지 첨부
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFadeLetterImageUpload} />
                  </label>
                </div>
                <div className="editor-agent-fields">
                  <textarea rows={7} placeholder="페이드의 협박편지 내용을 작성하세요." value={fadeLetterContent} onChange={(e) => setFadeLetterContent(e.target.value)} />
                  <div className="wizard-grid">
                    <input type="text" placeholder="콜사인 / 오멘" value={fadeLetterCallsign} onChange={(e) => setFadeLetterCallsign(e.target.value)} />
                    <input type="text" placeholder="이름 / 삭제됨" value={fadeLetterName} onChange={(e) => setFadeLetterName(e.target.value)} />
                    <input type="text" placeholder="분류 / 라디언트" value={fadeLetterClassification} onChange={(e) => setFadeLetterClassification(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="wizard-grid">
              <div className="wizard-field-group">
                <label>구매단계 대사</label>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 라운드 시작 전 | 이번 라운드는 조용히 끝내죠.'} value={buyPhaseQuotes} onChange={(e) => setBuyPhaseQuotes(e.target.value)} />
              </div>
              <div className="wizard-field-group">
                <label>라운드 진행 시 대사</label>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 스파이크 설치 | 지점을 지켜요.'} value={roundQuotes} onChange={(e) => setRoundQuotes(e.target.value)} />
              </div>
              <div className="wizard-field-group">
                <label>특정 요원과의 상호작용 대사</label>
                <textarea rows={4} placeholder={'상대 요원 | 대사 형식으로 한 줄씩 입력하세요.\n예: 브림스톤 | 명령만 주세요. 바로 움직입니다.'} value={interactionQuotes} onChange={(e) => setInteractionQuotes(e.target.value)} />
              </div>
              <div className="wizard-field-group">
                <label>처치 시 대사</label>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 마지막 처치 | 끝났습니다.'} value={killQuotes} onChange={(e) => setKillQuotes(e.target.value)} />
              </div>
            </div>

            <div className="wizard-field-group">
              <label>인게임 운용 팁 및 플레이 조언 (최대 3개)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="팁 1: 스킬 연계 방법, 방어 시 지점 팁 등" value={tip1} onChange={(e) => setTip1(e.target.value)} />
                <input type="text" placeholder="팁 2: 궁극기 활용 극대화 상황 등" value={tip2} onChange={(e) => setTip2(e.target.value)} />
                <input type="text" placeholder="팁 3: 맵별 포지션 배치 방법 등" value={tip3} onChange={(e) => setTip3(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div className="wizard-footer">
          {step > 1 ? (
            <button type="button" className="val-btn" onClick={prevStep}>
              <ArrowLeft size={12} /> 이전 단계
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button type="button" className="val-btn val-btn-accent" onClick={nextStep}>
              다음 단계 <ArrowRight size={12} />
            </button>
          ) : (
            <button type="submit" className="val-btn val-btn-accent" disabled={isUploading} style={{ background: 'var(--color-teal)', borderColor: 'var(--color-teal)' }}>
              <Save size={12} /> {isUploading ? '이미지 업로드 중...' : '요원 위키 등록!'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
