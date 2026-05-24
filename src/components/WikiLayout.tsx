import React, { useState, useRef, useEffect } from 'react';
import { useWiki } from '../context/useWiki';
import { Search, Sparkles, BookOpen, Clock, Dice5, Shield, Compass, ChevronLeft, ChevronRight, Database } from 'lucide-react';
import { hexToRgb } from '../utils/colorTheme';

interface WikiLayoutProps {
  children: React.ReactNode;
}

export const WikiLayout: React.FC<WikiLayoutProps> = ({ children }) => {
  const {
    articles,
    recentChanges,
    navigateToPage,
    activePage,
    dbStatus,
  } = useWiki();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const activeArticle = articles[activePage];
  const activeSignatureColor = activeArticle?.agentData?.signatureColor;
  const contentThemeStyle = activeSignatureColor
    ? ({
        '--agent-theme-color': activeSignatureColor,
        '--agent-theme-rgb': hexToRgb(activeSignatureColor)
      } as React.CSSProperties)
    : undefined;

  // Close suggestions popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter articles based on search query
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return Object.keys(articles)
      .filter(title => 
        title.toLowerCase().includes(query) || 
        articles[title].content.toLowerCase().includes(query)
      )
      .slice(0, 5) // Limit to 5 suggestions
      .map(title => ({
        title,
        category: articles[title].category
      }));
  }, [searchQuery, articles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToPage(searchQuery.trim());
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleRandomPage = () => {
    const keys = Object.keys(articles);
    if (keys.length > 0) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      navigateToPage(keys[randomIndex]);
    }
  };

  // Helper to format ISO timestamp relative or clean
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="logo-container" onClick={() => navigateToPage('대문')}>
          <div className="logo-icon">V</div>
          <span className="logo-text">VALOWIKI</span>
        </div>

        {/* Real-time Search Engine */}
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="문서명 또는 내용 검색..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
          </form>

          {/* Search Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-autocomplete">
              {suggestions.map((item) => (
                <div
                  key={item.title}
                  className="autocomplete-item"
                  onClick={() => {
                    navigateToPage(item.title);
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                >
                  <span className="autocomplete-title">{item.title}</span>
                  <span className="autocomplete-category">{item.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top bar operations */}
        <div className="navbar-actions">
          {/* DB status indicator */}
          <div className="db-status-badge" title={
            dbStatus === 'connected' ? 'Supabase 연결됨'
            : dbStatus === 'offline' ? 'DB 연결 없음 (로컬 전용)'
            : 'DB 연결 중...'
          }>
            <Database size={13} />
            <span className={`db-status-dot db-status-${dbStatus}`} />
          </div>
          <button className="val-btn" onClick={handleRandomPage}>
            <Dice5 size={14} />
            랜덤
          </button>
          <button className="val-btn val-btn-accent" onClick={() => navigateToPage('wizard')}>
            <Sparkles size={14} />
            요원 생성
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className={`main-layout ${isSidebarOpen ? '' : 'sidebar-is-closed'}`}>
        {!isSidebarOpen && (
          <button
            type="button"
            className="sidebar-reopen-button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="왼쪽 메뉴 열기"
          >
            <ChevronRight size={14} />
            메뉴
          </button>
        )}

        {/* Left Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? '' : 'sidebar-closed'}`} aria-hidden={!isSidebarOpen}>
          <div className="sidebar-control-row">
            <span>위키 메뉴</span>
            <button
              type="button"
              className="sidebar-toggle-button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="왼쪽 메뉴 닫기"
            >
              <ChevronLeft size={14} />
              닫기
            </button>
          </div>

          {/* Navigation Directory */}
          <div>
            <div className="sidebar-title">
              <Compass size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              주요 바로가기
            </div>
            <div className="recent-changes-list" style={{ gap: '6px' }}>
              <div 
                className={`recent-change-item ${activePage === '대문' ? 'active' : ''}`}
                onClick={() => navigateToPage('대문')}
                style={{ padding: '10px 12px' }}
              >
                <span className="recent-change-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={14} /> 대문 (Wiki Home)
                </span>
              </div>
            </div>
          </div>

          {/* Recent Changes feed (Namuwiki-style 최근변경) */}
          <div>
            <div className="sidebar-title">
              <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              최근 변경 문서
            </div>
            <div className="recent-changes-list">
              {recentChanges.map((change) => (
                <div
                  key={`${change.title}-${change.version}`}
                  className="recent-change-item"
                  onClick={() => navigateToPage(change.title)}
                >
                  <div className="recent-change-title">{change.title}</div>
                  <div className="recent-change-meta">
                    <span style={{ color: 'var(--color-teal)' }}>r{change.version}</span>
                    <span>{change.author}</span>
                    <span>{formatTime(change.updatedAt)}</span>
                  </div>
                  {change.comment && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      ({change.comment})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main
          className={`content-area ${activeSignatureColor ? 'agent-content-area' : ''}`}
          style={contentThemeStyle}
        >
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
