import React from 'react';
import { useWiki } from '../context/useWiki';
import { Edit2, History, Trash2, Eye, FileWarning } from 'lucide-react';
import { AgentHUD } from './AgentHUD';
import { hexToRgb } from '../utils/colorTheme';

export const WikiReader: React.FC = () => {
  const {
    articles,
    activePage,
    navigateToPage,
    deleteArticle,
    isAgentView,
    setIsAgentView,
    setViewMode
  } = useWiki();

  const article = articles[activePage];
  const agentThemeStyle = article?.agentData?.signatureColor
    ? ({
        '--color-accent': article.agentData.signatureColor,
        '--color-accent-rgb': hexToRgb(article.agentData.signatureColor),
        '--color-teal': article.agentData.signatureColor,
        '--color-teal-rgb': hexToRgb(article.agentData.signatureColor)
      } as React.CSSProperties)
    : undefined;

  // Intercept links clicked inside the parsed HTML content to route client-side
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const pageTitle = target.getAttribute('data-wiki-page');
    if (pageTitle) {
      e.preventDefault();
      navigateToPage(pageTitle);
    }
  };

  // Custom regex-based Namuwiki/Markdown Parser
  const parseWikiText = (text: string) => {
    if (!text) return '';

    // HTML Escaping
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/'''(.*?)'''/g, '<strong>$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/''(.*?)''/g, '<em>$1</em>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headings
    html = html.replace(/^\s*===\s*(.*?)\s*===\s*$/gm, '<h3>$3a0daa45-9869-4a6f-94b7-97510fdbc89d-$1</h3>');
    html = html.replace(/^\s*==\s*(.*?)\s*==\s*$/gm, '<h2>$1</h2>');
    html = html.replace(/^\s*#\s*(.*?)\s*$/gm, '<h2>$1</h2>');
    // clean up sub-heading formatting temp ids
    html = html.replace(/<h3>3a0daa45-9869-4a6f-94b7-97510fdbc89d-(.*?)<\/h3>/g, '<h3>$1</h3>');

    // Blockquotes
    html = html.replace(/^\s*&gt;\s*(.*?)$/gm, '<blockquote>$1</blockquote>');

    // Lists (Groups)
    html = html.replace(/^\s*[*-]\s*(.*?)$/gm, '<li>$1</li>');

    // Namuwiki-style internal links: [[PageName|DisplayText]] and [[PageName]]
    const linkRegex = /\[\[(.*?)\]\]/g;
    html = html.replace(linkRegex, (_match, inner) => {
      const parts = inner.split('|');
      const pageTitle = parts[0].trim();
      const displayText = parts[1] ? parts[1].trim() : pageTitle;
      
      const exists = !!articles[pageTitle];
      const className = exists ? 'wiki-link' : 'wiki-link missing';
      return `<a href="#/wiki/${encodeURIComponent(pageTitle)}" class="${className}" data-wiki-page="${pageTitle}">${displayText}</a>`;
    });

    // Paragraph blocks & Line breaks
    const blocks = html.split('\n\n');
    const parsedBlocks = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li>')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    });

    return parsedBlocks.join('\n');
  };

  const handleDelete = () => {
    if (window.confirm(`정말로 '${activePage}' 문서를 완전히 삭제하시겠습니까? (삭제된 내역은 복구할 수 없습니다)`)) {
      deleteArticle(activePage);
    }
  };

  // Toggle agent show modes safely
  const toggleAgentViewMode = () => {
    setIsAgentView(prev => !prev);
  };

  const triggerEditMode = () => {
    setViewMode('edit');
  };

  const triggerHistoryMode = () => {
    setViewMode('history');
  };

  // 1. Document Not Found state
  if (!article) {
    return (
      <div className="wiki-card fade-in" style={{ borderColor: 'rgba(255, 70, 85, 0.4)', background: 'rgba(23, 33, 45, 0.9)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '20px' }}>
          <FileWarning size={64} style={{ color: 'var(--color-accent)' }} />
          <h1 style={{ fontSize: '28px', textTransform: 'none', color: 'var(--text-primary)' }}>
            '{activePage}' 문서를 찾을 수 없습니다
          </h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
            해당 문서는 아직 생성되지 않았거나 삭제되었습니다. 아래 버튼을 눌러 발로란트 세계관의 일원이 될 새로운 창작 문서를 만들어 보시겠습니까?
          </p>
          <button className="val-btn val-btn-accent" onClick={triggerEditMode} style={{ marginTop: '12px' }}>
            <Edit2 size={14} />
            새로운 문서 작성하기
          </button>
        </div>
      </div>
    );
  }

  // 2. Interactive Agent HUD view (For Agent category)
  if (article.category === '요원' && article.agentData && isAgentView) {
    return (
      <div className="fade-in agent-themed-page" style={agentThemeStyle}>
        {/* Toggle Panel at Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(15, 25, 35, 0.5)', padding: '12px 24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>뷰 모드 선택:</span>
            <button className="val-btn val-btn-secondary" onClick={toggleAgentViewMode}>
              <Eye size={12} /> 위키 문서 텍스트로 보기
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="val-btn" onClick={triggerEditMode}>
              <Edit2 size={12} /> 요원 편집
            </button>
            <button className="val-btn" onClick={triggerHistoryMode}>
              <History size={12} /> 편집 역사
            </button>
            {article.title !== '대문' && (
              <button className="val-btn val-btn-danger" onClick={handleDelete}>
                <Trash2 size={12} /> 삭제
              </button>
            )}
          </div>
        </div>

        {/* Breathtaking HUD component */}
        <AgentHUD data={article.agentData} />
      </div>
    );
  }

  // 3. Standard Wiki Reader view (like Namuwiki)
  return (
    <div className="wiki-card fade-in" style={agentThemeStyle}>
      {/* Article Navigation Header */}
      <div className="wiki-title-container">
        <div>
          <h1 className="wiki-title">
            {article.title}
            <span className="wiki-category-tag">{article.category === '요원' ? '요원 프로필' : '일반 문서'}</span>
          </h1>
        </div>
        
        {/* Operations */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {article.category === '요원' && article.agentData && (
            <button className="val-btn val-btn-secondary" onClick={toggleAgentViewMode}>
              <Eye size={12} /> 에이전트 HUD 쇼케이스 보기
            </button>
          )}
          <button className="val-btn" onClick={triggerEditMode}>
            <Edit2 size={12} /> 편집
          </button>
          <button className="val-btn" onClick={triggerHistoryMode}>
            <History size={12} /> 역사
          </button>
          {article.title !== '대문' && (
            <button className="val-btn" onClick={handleDelete} style={{ color: 'var(--color-accent)', borderColor: 'rgba(255,70,85,0.3)' }}>
              <Trash2 size={12} /> 삭제
            </button>
          )}
        </div>
      </div>

      {/* Main text area */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Classic Infobox on the right side if category is 요원 */}
        {article.category === '요원' && article.agentData && (
          <div className="wiki-infobox fade-in">
            <div className="wiki-infobox-header">
              {article.agentData.codename} / {article.agentData.nameKr}
            </div>
            <div className="wiki-infobox-image-container">
              <img
                src={article.agentData.portrait}
                alt={article.agentData.nameKr}
                className="wiki-infobox-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=AGENT+ART';
                }}
              />
            </div>
            <div className="wiki-infobox-row">
              <div className="wiki-infobox-label">역할군</div>
              <div className="wiki-infobox-value">{article.agentData.role}</div>
            </div>
            <div className="wiki-infobox-row">
              <div className="wiki-infobox-label">국적</div>
              <div className="wiki-infobox-value">{article.agentData.nationality}</div>
            </div>
            <div className="wiki-infobox-row">
              <div className="wiki-infobox-label">대표 코드네임</div>
              <div className="wiki-infobox-value" style={{ fontFamily: 'var(--font-mono)' }}>{article.agentData.codename}</div>
            </div>
          </div>
        )}

        {/* Document Content */}
        <div
          className="wiki-content"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: parseWikiText(article.content) }}
        />
      </div>

      {/* Timestamp footer */}
      <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>분류: 발로란트 창작 위키 ({article.category})</span>
        <span>최근 수정 시각: {new Date(article.updatedAt).toLocaleString('ko-KR')}</span>
      </div>
    </div>
  );
};
