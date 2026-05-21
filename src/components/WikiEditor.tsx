import React, { useState } from 'react';
import { useWiki } from '../context/useWiki';
import { Save, X, Bold, Italic, Link2, Heading, Quote, List, HelpCircle, ImagePlus } from 'lucide-react';
import type { Ability } from '../data/initialArticles';
import { imageFileToDataUrl } from '../utils/imageUpload';
import { linesToText, relationshipsToText, textToLines, textToRelationships } from '../utils/agentText';

export const WikiEditor: React.FC = () => {
  const {
    activePage,
    articles,
    saveArticle,
    navigateToPage,
    setViewMode
  } = useWiki();

  const existingArticle = articles[activePage];

  const [content, setContent] = useState(existingArticle?.content || '');
  const [category, setCategory] = useState<'일반' | '요원'>(existingArticle?.category || '일반');
  const [editComment, setEditComment] = useState('');
  const [agentPortrait, setAgentPortrait] = useState(existingArticle?.agentData?.portrait || '/glint.png');
  const [agentQuote, setAgentQuote] = useState(existingArticle?.agentData?.quote || '');
  const [agentBio, setAgentBio] = useState(existingArticle?.agentData?.bio || '');
  const [agentSignatureColor, setAgentSignatureColor] = useState(existingArticle?.agentData?.signatureColor || '#ff4655');
  const [agentImageFileName, setAgentImageFileName] = useState('');
  const [agentImageError, setAgentImageError] = useState('');
  const [agentAbilities, setAgentAbilities] = useState<Ability[]>(existingArticle?.agentData?.abilities || []);
  const [contractRewardsText, setContractRewardsText] = useState(linesToText(existingArticle?.agentData?.contractRewards));
  const [relationshipsText, setRelationshipsText] = useState(relationshipsToText(existingArticle?.agentData?.relationships));
  const [fadeLetterImage, setFadeLetterImage] = useState(existingArticle?.agentData?.fadeLetter?.image || existingArticle?.agentData?.portrait || '/glint.png');
  const [fadeLetterContent, setFadeLetterContent] = useState(existingArticle?.agentData?.fadeLetter?.content || '');
  const [fadeLetterCallsign, setFadeLetterCallsign] = useState(existingArticle?.agentData?.fadeLetter?.callsign || existingArticle?.agentData?.codename || '');
  const [fadeLetterName, setFadeLetterName] = useState(existingArticle?.agentData?.fadeLetter?.name || existingArticle?.agentData?.nameKr || '');
  const [fadeLetterClassification, setFadeLetterClassification] = useState(existingArticle?.agentData?.fadeLetter?.classification || '라디언트');
  const [buyPhaseQuotesText, setBuyPhaseQuotesText] = useState(linesToText(existingArticle?.agentData?.buyPhaseQuotes));
  const [roundQuotesText, setRoundQuotesText] = useState(linesToText(existingArticle?.agentData?.roundQuotes));
  const [interactionQuotesText, setInteractionQuotesText] = useState(linesToText(existingArticle?.agentData?.interactionQuotes));
  const [killQuotesText, setKillQuotesText] = useState(linesToText(existingArticle?.agentData?.killQuotes));

  const isEditingAgentProfile = category === '요원' && !!existingArticle?.agentData;

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('wiki-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    setContent(text.substring(0, start) + replacement + text.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const parsePreviewText = (text: string) => {
    if (!text) return '';

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/'''(.*?)'''/g, '<strong>$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/''(.*?)''/g, '<em>$1</em>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*===\s*(.*?)\s*===\s*$/gm, '<h3>$1</h3>');
    html = html.replace(/^\s*==\s*(.*?)\s*==\s*$/gm, '<h2>$1</h2>');
    html = html.replace(/^\s*#\s*(.*?)\s*$/gm, '<h2>$1</h2>');
    html = html.replace(/^\s*&gt;\s*(.*?)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^\s*[*-]\s*(.*?)$/gm, '<li>$1</li>');

    html = html.replace(/\[\[(.*?)\]\]/g, (_, inner) => {
      const parts = inner.split('|');
      const pageTitle = parts[0].trim();
      const displayText = parts[1] ? parts[1].trim() : pageTitle;
      const exists = !!articles[pageTitle];
      const className = exists ? 'wiki-link' : 'wiki-link missing';
      return `<span class="${className}">${displayText}</span>`;
    });

    return html.split('\n\n').map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li>')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');
  };

  const updateAgentAbility = (key: Ability['key'], patch: Partial<Ability>) => {
    setAgentAbilities(prev => prev.map(ability => ability.key === key ? { ...ability, ...patch } : ability));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAgentData = isEditingAgentProfile && existingArticle?.agentData
      ? {
          ...existingArticle.agentData,
          portrait: agentPortrait,
          quote: agentQuote.trim() || existingArticle.agentData.quote,
          bio: agentBio.trim() || existingArticle.agentData.bio,
          signatureColor: agentSignatureColor,
          abilities: agentAbilities,
          contractRewards: textToLines(contractRewardsText),
          relationships: textToRelationships(relationshipsText),
          fadeLetter: {
            image: fadeLetterImage,
            content: fadeLetterContent.trim() || '아직 해독되지 않은 페이드의 협박편지입니다.',
            callsign: fadeLetterCallsign.trim() || existingArticle.agentData.codename,
            name: fadeLetterName.trim() || existingArticle.agentData.nameKr,
            classification: fadeLetterClassification.trim() || '라디언트'
          },
          buyPhaseQuotes: textToLines(buyPhaseQuotesText),
          roundQuotes: textToLines(roundQuotesText),
          interactionQuotes: textToLines(interactionQuotesText),
          killQuotes: textToLines(killQuotesText)
        }
      : undefined;

    saveArticle(activePage, content, category, editComment.trim(), updatedAgentData);
    setViewMode('read');
  };

  const handleAgentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const dataUrl = await imageFileToDataUrl(file);
      setAgentPortrait(dataUrl);
      setAgentImageFileName(file.name);
      setAgentImageError('');
    } catch (error) {
      setAgentImageError(error instanceof Error ? error.message : '이미지를 읽을 수 없습니다.');
    }
  };

  const handleAbilityImageUpload = async (key: Ability['key'], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      updateAgentAbility(key, { image: await imageFileToDataUrl(file) });
    } catch {
      alert('스킬 아이콘 이미지를 읽을 수 없습니다.');
    }
  };

  const handleFadeLetterImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      setFadeLetterImage(await imageFileToDataUrl(file));
    } catch {
      alert('페이드 협박편지 이미지를 읽을 수 없습니다.');
    }
  };

  const handleAgentImageDelete = () => {
    setAgentPortrait('/glint.png');
    setAgentImageFileName('');
    setAgentImageError('');
  };

  const handleCancel = () => {
    setViewMode('read');
    navigateToPage(activePage);
  };

  return (
    <div className="wiki-card fade-in">
      <div className="wiki-title-container">
        <h1 className="wiki-title">문서 편집: {activePage}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="val-btn val-btn-accent" onClick={handleSave}>
            <Save size={12} /> 저장
          </button>
          <button className="val-btn" onClick={handleCancel}>
            <X size={12} /> 취소
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="editor-container">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>문서 분류:</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="category" value="일반" checked={category === '일반'} onChange={() => setCategory('일반')} />
              일반 위키 문서
            </label>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="category" value="요원" checked={category === '요원'} onChange={() => setCategory('요원')} />
              발로란트 창작 요원 프로필
            </label>
          </div>
        </div>

        {isEditingAgentProfile && (
          <div className="editor-agent-panel">
            <div className="sidebar-title" style={{ fontSize: '15px', marginBottom: '0' }}>
              요원 프로필 정보
            </div>
            <div className="editor-agent-grid">
              <div className="portrait-upload-preview editor-agent-preview">
                <img src={agentPortrait} alt={`${activePage} 초상화 미리보기`} />
              </div>
              <div className="editor-agent-fields">
                <label className="editor-agent-field">
                  <span>캐릭터 이미지</span>
                  <div className="editor-agent-actions">
                    <label className="val-btn portrait-upload-button">
                      이미지 첨부
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleAgentImageUpload} />
                    </label>
                    {agentImageFileName && <span className="editor-agent-file">{agentImageFileName}</span>}
                    <button type="button" className="val-btn val-btn-danger" onClick={handleAgentImageDelete}>이미지 삭제</button>
                  </div>
                  {agentImageError && <div className="portrait-upload-error">{agentImageError}</div>}
                </label>

                <label className="editor-agent-field">
                  <span>상단 캐릭터 대사</span>
                  <input type="text" placeholder="요원 선택 대사를 입력하세요." value={agentQuote} onChange={(e) => setAgentQuote(e.target.value)} />
                </label>

                <label className="editor-agent-field">
                  <span>상단 요약 설명</span>
                  <textarea rows={3} placeholder="캐릭터 카드 하단에 표시될 짧은 설명을 입력하세요." value={agentBio} onChange={(e) => setAgentBio(e.target.value)} />
                </label>

                <label className="editor-agent-field">
                  <span>시그니처 컬러</span>
                  <div className="signature-color-row">
                    <input type="color" value={agentSignatureColor} onChange={(e) => setAgentSignatureColor(e.target.value)} aria-label="요원 시그니처 컬러" />
                    <input type="text" value={agentSignatureColor} onChange={(e) => setAgentSignatureColor(e.target.value)} aria-label="요원 시그니처 컬러 코드" />
                    <span className="signature-color-preview" style={{ background: agentSignatureColor }} />
                  </div>
                </label>
              </div>
            </div>

            <div className="editor-section-grid">
              <label className="editor-agent-field">
                <span>계약 보상</span>
                <textarea rows={5} placeholder={'한 줄에 하나씩 입력하세요.\n예: 1티어 - 플레이어 카드'} value={contractRewardsText} onChange={(e) => setContractRewardsText(e.target.value)} />
              </label>

              <label className="editor-agent-field">
                <span>타 요원간의 관계</span>
                <textarea rows={5} placeholder={'요원명 | 관계 설명 형식으로 한 줄씩 입력하세요.\n예: 브림스톤 | 현장 판단을 신뢰한다.'} value={relationshipsText} onChange={(e) => setRelationshipsText(e.target.value)} />
              </label>
            </div>

            <div className="editor-ability-block">
              <div className="sidebar-title" style={{ fontSize: '15px', marginBottom: '0' }}>스킬 아이콘 및 사용 대사</div>
              <div className="ability-editor-grid">
                {agentAbilities.map(ability => (
                  <div className="wiki-card ability-draft-card" key={ability.key}>
                    <div className="ability-draft-title">[{ability.key}] {ability.name}</div>
                    <div className="ability-draft-fields">
                      <input type="text" value={ability.name} onChange={(e) => updateAgentAbility(ability.key, { name: e.target.value })} />
                      <div className="ability-draft-row">
                        <input type="text" value={ability.cost} onChange={(e) => updateAgentAbility(ability.key, { cost: e.target.value })} />
                        <input type="text" value={ability.charges} onChange={(e) => updateAgentAbility(ability.key, { charges: e.target.value })} />
                      </div>
                      <textarea rows={3} value={ability.description} onChange={(e) => updateAgentAbility(ability.key, { description: e.target.value })} />
                      {ability.image && <img className="ability-image-preview" src={ability.image} alt={`${ability.name} 아이콘 미리보기`} />}
                      <div className="editor-agent-actions">
                        <label className="val-btn portrait-upload-button">
                          <ImagePlus size={12} /> 스킬 아이콘 첨부
                          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleAbilityImageUpload(ability.key, e)} />
                        </label>
                        {ability.image && (
                          <button type="button" className="val-btn val-btn-danger" onClick={() => updateAgentAbility(ability.key, { image: '' })}>
                            이미지 삭제
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={4}
                        placeholder="스킬 사용 시 대사를 한 줄에 하나씩 입력하세요."
                        value={linesToText(ability.voiceLines)}
                        onChange={(e) => updateAgentAbility(ability.key, { voiceLines: textToLines(e.target.value) })}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
                    <input type="text" placeholder="콜사인" value={fadeLetterCallsign} onChange={(e) => setFadeLetterCallsign(e.target.value)} />
                    <input type="text" placeholder="이름" value={fadeLetterName} onChange={(e) => setFadeLetterName(e.target.value)} />
                    <input type="text" placeholder="분류" value={fadeLetterClassification} onChange={(e) => setFadeLetterClassification(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="editor-section-grid">
              <label className="editor-agent-field">
                <span>구매단계 대사</span>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 라운드 시작 전 | 이번 라운드는 조용히 끝내죠.'} value={buyPhaseQuotesText} onChange={(e) => setBuyPhaseQuotesText(e.target.value)} />
              </label>
              <label className="editor-agent-field">
                <span>라운드 진행 시 대사</span>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 스파이크 설치 | 지점을 지켜요.'} value={roundQuotesText} onChange={(e) => setRoundQuotesText(e.target.value)} />
              </label>
              <label className="editor-agent-field">
                <span>특정 요원과의 상호작용 대사</span>
                <textarea rows={4} placeholder={'상대 요원 | 대사 형식으로 한 줄씩 입력하세요.\n예: 브림스톤 | 명령만 주세요. 바로 움직입니다.'} value={interactionQuotesText} onChange={(e) => setInteractionQuotesText(e.target.value)} />
              </label>
              <label className="editor-agent-field">
                <span>처치 시 대사</span>
                <textarea rows={4} placeholder={'상황 | 대사 형식으로 한 줄씩 입력하세요.\n예: 마지막 처치 | 끝났습니다.'} value={killQuotesText} onChange={(e) => setKillQuotesText(e.target.value)} />
              </label>
            </div>
          </div>
        )}

        <div className="editor-toolbar">
          <button type="button" className="editor-btn" onClick={() => insertText("'''", "'''")} title="굵게"><Bold size={14} /></button>
          <button type="button" className="editor-btn" onClick={() => insertText("''", "''")} title="기울임"><Italic size={14} /></button>
          <button type="button" className="editor-btn" onClick={() => insertText("[[", "]]")} title="내부 링크"><Link2 size={14} /></button>
          <button type="button" className="editor-btn" onClick={() => insertText("== ", " ==")} title="제목 2단계"><Heading size={14} /></button>
          <button type="button" className="editor-btn" onClick={() => insertText("=== ", " ===")} title="제목 3단계"><span style={{ fontWeight: 'bold' }}>H3</span></button>
          <button type="button" className="editor-btn" onClick={() => insertText("> ")} title="인용구"><Quote size={14} /></button>
          <button type="button" className="editor-btn" onClick={() => insertText("* ")} title="글머리 목록"><List size={14} /></button>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={12} /> 위키 텍스트 작성법 적용
          </span>
        </div>

        <div className="editor-grid">
          <div>
            <textarea
              id="wiki-textarea"
              className="editor-textarea"
              placeholder="내용을 입력해 주세요. [[문서이름]]을 통해 연결 고리를 만들 수 있습니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-teal)', marginBottom: '8px', textTransform: 'uppercase' }}>
              실시간 프리뷰 (Live Preview)
            </div>
            <div
              className="editor-preview wiki-content"
              dangerouslySetInnerHTML={{ __html: parsePreviewText(content) || '<p style="color: var(--text-muted)">작성 중인 내용이 여기에 실시간으로 표시됩니다.</p>' }}
            />
          </div>
        </div>

        <div className="editor-comment-row">
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            편집 코멘트 (수정 이력 설명):
          </label>
          <input
            type="text"
            placeholder="수정한 사항을 짧게 적어주세요. 예: 스킬 아이콘 추가, 대사 보강"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            style={{ width: '100%', background: '#090e14' }}
          />
        </div>
      </form>
    </div>
  );
};
