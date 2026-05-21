import React, { useState } from 'react';
import { useWiki } from '../context/useWiki';
import { Clock, Undo, Eye, ArrowLeft, Terminal } from 'lucide-react';

export const WikiHistory: React.FC = () => {
  const {
    activePage,
    history,
    rollbackToVersion,
    navigateToPage,
    setViewMode
  } = useWiki();

  const revisions = history[activePage] || [];
  const [selectedRevVersion, setSelectedRevVersion] = useState<number | null>(null);

  // Get content of selected revision
  const selectedRevision = revisions.find(r => r.version === selectedRevVersion);

  const handleRollback = (version: number) => {
    if (window.confirm(`정말로 이 문서를 r${version} 상태로 되돌리시겠습니까? (새로운 수정 버전으로 저장됩니다)`)) {
      rollbackToVersion(activePage, version);
      setViewMode('read');
    }
  };

  const handleBackToArticle = () => {
    setViewMode('read');
    navigateToPage(activePage);
  };

  return (
    <div className="wiki-card fade-in">
      {/* Title */}
      <div className="wiki-title-container">
        <h1 className="wiki-title" style={{ gap: '12px' }}>
          <Clock size={28} style={{ color: 'var(--color-accent)' }} />
          문서 역사: {activePage}
        </h1>
        <button className="val-btn" onClick={handleBackToArticle}>
          <ArrowLeft size={12} /> 문서로 돌아가기
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
        이 문서의 모든 편집 기록입니다. 임의의 버전의 내용을 들여다보거나, 실수로 훼손된 문서를 이전 버전 상태로 되돌릴 수 있습니다.
      </p>

      {/* Revision Table */}
      <table className="history-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>버전</th>
            <th style={{ width: '180px' }}>수정 시각</th>
            <th style={{ width: '150px' }}>수정자</th>
            <th>수정 코멘트</th>
            <th style={{ width: '200px', textAlign: 'right' }}>작업</th>
          </tr>
        </thead>
        <tbody>
          {[...revisions].reverse().map((rev) => (
            <tr key={rev.version}>
              <td>
                <span className="history-version-badge">r{rev.version}</span>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {new Date(rev.timestamp).toLocaleString('ko-KR')}
              </td>
              <td style={{ fontWeight: '500' }}>{rev.author}</td>
              <td style={{ color: 'var(--text-primary)' }}>{rev.comment}</td>
              <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  className={`val-btn ${selectedRevVersion === rev.version ? 'val-btn-secondary' : ''}`}
                  onClick={() => setSelectedRevVersion(selectedRevVersion === rev.version ? null : rev.version)}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  <Eye size={10} /> 내용 보기
                </button>
                {rev.version !== revisions[revisions.length - 1]?.version && (
                  <button 
                    className="val-btn val-btn-accent"
                    onClick={() => handleRollback(rev.version)}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    <Undo size={10} /> 되돌리기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected Version Raw Text Container */}
      {selectedRevision && (
        <div className="fade-in" style={{ marginTop: '32px', background: '#090e14', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal)', marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            <Terminal size={14} />
            <span>[역사 조회] r{selectedRevision.version} 버전의 원문 텍스트</span>
          </div>
          <pre style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '13px', 
            whiteSpace: 'pre-wrap', 
            color: 'var(--text-primary)',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.3)',
            padding: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {selectedRevision.content}
          </pre>
        </div>
      )}
    </div>
  );
};
