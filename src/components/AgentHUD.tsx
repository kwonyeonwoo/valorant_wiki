import React, { useState } from 'react';
import type { AgentData } from '../data/initialArticles';
import {
  Shield,
  HelpCircle,
  Activity,
  Award,
  User,
  Flame,
  Crosshair,
  ScrollText,
  Handshake,
  MessageSquare,
  Coins
} from 'lucide-react';

interface AgentHUDProps {
  data: AgentData;
}

export const AgentHUD: React.FC<AgentHUDProps> = ({ data }) => {
  const [selectedAbilityKey, setSelectedAbilityKey] = useState<'C' | 'Q' | 'E' | 'X'>('E');

  const selectedAbility = data.abilities.find(a => a.key === selectedAbilityKey) || data.abilities[2] || data.abilities[0];
  const agentQuote = data.quote || '내 앞을 막아서는 순간, 전장은 이미 내 것이 됩니다.';
  const fadeLetter = data.fadeLetter || {
    image: data.portrait,
    content: '아직 작성된 페이드의 협박편지가 없습니다. 편집 화면에서 이미지, 편지 내용, 콜사인, 이름, 분류를 추가할 수 있습니다.',
    callsign: data.codename,
    name: data.nameKr,
    classification: '미분류'
  };

  const renderRoleInfo = () => {
    switch (data.role) {
      case '전략가':
        return {
          icon: <Activity size={16} style={{ color: 'var(--color-teal)' }} />,
          description: '전략가는 아군이 유리하게 전진할 수 있도록 위험 지역을 차단하고 아군을 지원하는 역할을 맡습니다.'
        };
      case '감시자':
        return {
          icon: <Shield size={16} style={{ color: 'var(--color-teal)' }} />,
          description: '감시자는 아군의 공격로를 확보하고 거점을 수호하며, 적의 침투를 방어하는 역할을 담당합니다.'
        };
      case '타격대':
        return {
          icon: <Flame size={16} style={{ color: 'var(--color-accent)' }} />,
          description: '타격대는 팀의 선봉에 서서 적군과의 직접 교전을 수행하고 킬을 올리는 돌격 대원 역할을 지닙니다.'
        };
      case '척후병':
        return {
          icon: <Crosshair size={16} style={{ color: 'var(--color-accent)' }} />,
          description: '척후병은 적의 위치 정보를 습득하고 시야를 밝히며, 아군이 진입하는 루트를 개척하는 역할을 합니다.'
        };
      default:
        return {
          icon: <HelpCircle size={16} />,
          description: '설정된 역할군이 아직 정의되지 않았습니다.'
        };
    }
  };

  const renderLineList = (lines?: string[]) => {
    if (!lines?.length) return <p className="empty-agent-note">아직 작성된 항목이 없습니다.</p>;

    return (
      <ul className="agent-line-list">
        {lines.map((line, index) => (
          <li key={`${line}-${index}`}>{line}</li>
        ))}
      </ul>
    );
  };

  const parseDialogueLine = (line: string) => {
    const [label, ...textParts] = line.split('|').map(part => part.trim());
    const text = textParts.join(' | ');

    if (!text) {
      return {
        label: '',
        text: label
      };
    }

    return { label, text };
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const renderTocButton = (id: string, label: string) => (
    <button type="button" className="toc-link" onClick={() => scrollToSection(id)}>
      {label}
    </button>
  );

  const renderSectionNumber = (id: string, number: string) => (
    <button type="button" className="section-number-link" onClick={() => scrollToSection(id)}>
      {number}.
    </button>
  );

  const renderAbilityIcon = (image: string | undefined, alt: string, className = 'ability-icon') => (
    image ? (
      <img className={className} src={image} alt={alt} />
    ) : (
      <span className={`${className} ability-icon-placeholder`} aria-hidden="true" />
    )
  );

  const renderDialogueSection = (number: string, title: string, lines?: string[], emptyText = '아직 작성된 대사가 없습니다.') => (
    <section className="dialogue-section" id={`agent-section-${number.replace(/\./g, '-')}`}>
      <h3>
        {renderSectionNumber(`agent-section-${number.replace(/\./g, '-')}`, number)}
        <span>{title}</span>
      </h3>
      {lines?.length ? (
        <div className="dialogue-list">
          {lines.map((line, index) => {
            const parsed = parseDialogueLine(line);
            return (
              <div className="dialogue-item" key={`${title}-${line}-${index}`}>
                {parsed.label && <span className="dialogue-label">{parsed.label}</span>}
                <p>{parsed.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-agent-note">{emptyText}</p>
      )}
    </section>
  );

  const roleInfo = renderRoleInfo();

  return (
    <div className="agent-hud-container fade-in">
      <div className="agent-showcase-layout">
        <div className="agent-quote-panel">
          <strong>{agentQuote}</strong>
          <span>(Stand in my way, I dare you.)</span>
          <small>- 요원 선택 대사</small>
        </div>

        <div className="agent-profile-card">
          <div className="agent-card-corner agent-card-corner-left">V</div>
          <div className="agent-card-corner agent-card-corner-right">13.</div>
          <div className="agent-profile-image-wrap">
            <img
              src={data.portrait}
              alt={data.codename}
              className="agent-profile-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/520x620?text=AGENT+KEY+ART';
              }}
            />
          </div>

          <div className="agent-profile-summary">
            <h2>
              {data.nameKr}
              <span>{data.codename}</span>
            </h2>
            <p>{data.bio}</p>
          </div>

          <dl className="agent-profile-facts">
            <div>
              <dt>역할</dt>
              <dd>{roleInfo.icon}<span>{data.role}</span></dd>
            </div>
            <div>
              <dt>본명</dt>
              <dd>{data.nameKr}</dd>
            </div>
            <div>
              <dt>출신지</dt>
              <dd>{data.nationality}</dd>
            </div>
            <div>
              <dt>분류</dt>
              <dd>발로란트 창작 요원</dd>
            </div>
          </dl>
        </div>
      </div>

      <nav className="agent-page-toc" aria-label="요원 문서 목차">
        <div className="agent-page-toc-title">목차</div>
        <ol>
          <li>{renderTocButton('agent-section-1', '1. 개요')}</li>
          <li>{renderTocButton('agent-section-2', '2. 계약 보상')}</li>
          <li>{renderTocButton('agent-section-3', '3. 스킬')}</li>
          <li>{renderTocButton('agent-section-4', '4. 타 요원간의 관계')}</li>
          <li>
            {renderTocButton('agent-section-5', '5. 대사')}
            <ol>
              <li>{renderTocButton('agent-section-5-1', '5.1. 요원 선택')}</li>
              <li>{renderTocButton('agent-section-5-2', '5.2. 구매단계')}</li>
              <li>{renderTocButton('agent-section-5-3', '5.3. 라운드 진행')}</li>
              <li>{renderTocButton('agent-section-5-4', '5.4. 특정 요원 상호작용')}</li>
              <li>{renderTocButton('agent-section-5-5', '5.5. 처치')}</li>
            </ol>
          </li>
          <li>{renderTocButton('agent-section-6', '6. 요원 공식 배경')}</li>
          <li>{renderTocButton('agent-section-7', '7. 페이드의 협박편지')}</li>
        </ol>
      </nav>

      <section className="agent-section" id="agent-section-1">
        <h2>{renderSectionNumber('agent-section-1', '1')}<span>개요</span></h2>
        <p>{roleInfo.description}</p>
      </section>

      <div className="agent-extra-grid">
        <section className="agent-extra-panel" id="agent-section-2">
          <div className="sidebar-title" style={{ fontSize: '16px' }}>
            <Coins size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            2. 계약 보상
          </div>
          {renderLineList(data.contractRewards)}
        </section>

        <section className="agent-extra-panel" id="agent-section-4">
          <div className="sidebar-title" style={{ fontSize: '16px' }}>
            <Handshake size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            4. 타 요원간의 관계
          </div>
          {data.relationships?.length ? (
            <div className="relationship-list">
              {data.relationships.map((relationship, index) => (
                <div className="relationship-row" key={`${relationship.agent}-${index}`}>
                  <strong>{relationship.agent}</strong>
                  <span>{relationship.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-agent-note">아직 작성된 관계가 없습니다.</p>
          )}
        </section>
      </div>

      <section className="abilities-container" id="agent-section-3">
        <div className="abilities-title">
          <Award size={18} />
          <span>3. 요원 스킬 정보 (Abilities Interface)</span>
        </div>

        <div className="abilities-hud-row">
          {data.abilities.map((ability) => {
            const isSelected = ability.key === selectedAbilityKey;
            const isSignature = ability.key === 'E';
            return (
              <div
                key={ability.key}
                className={`ability-hud-card ${isSignature ? 'signature' : ''} ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedAbilityKey(ability.key)}
              >
                <div className="ability-hud-header">
                  <span className="ability-hud-key">{ability.key}</span>
                  <span className="ability-hud-type">{ability.key === 'X' ? '궁극기' : (isSignature ? '시그니처' : '기본 스킬')}</span>
                </div>
                <div className="ability-hud-name">
                  {renderAbilityIcon(ability.image, `${ability.name} 아이콘`, 'ability-hud-icon')}
                  <span>{ability.name}</span>
                </div>
                <div className="ability-hud-meta">
                  <span>비용: {ability.cost}</span>
                  <span>충전: {ability.charges}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedAbility && (
          <div className="ability-detail-pane">
            <div className="ability-use-card">
              <div className="ability-use-icon-wrap">
                {renderAbilityIcon(selectedAbility.image, `${selectedAbility.name} 아이콘`, 'ability-use-icon')}
              </div>
              <div className="ability-use-content">
                <div className="ability-detail-name">
                  <strong>{selectedAbility.name}</strong>
                  <span>| {selectedAbility.type}</span>
                </div>
                <p className="ability-detail-desc">{selectedAbility.description}</p>
              </div>
              <div className="ability-use-meta">
                <span>¤ {selectedAbility.cost}</span>
                <span>{selectedAbility.charges}</span>
              </div>
            </div>
            <div className="ability-dialogue-box">
              <div className="ability-dialogue-title">[ 대사 모음 ]</div>
              <div className="ability-dialogue-subtitle">{selectedAbility.name} 사용</div>
              {renderLineList(selectedAbility.voiceLines)}
            </div>
          </div>
        )}
      </section>

      <section className="agent-dialogue-archive" id="agent-section-5">
        <div className="sidebar-title" style={{ fontSize: '16px' }}>
          <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          5. 대사
        </div>
        <p className="dialogue-help-text">
          각 항목은 편집 화면에서 <strong>상황 | 대사</strong> 형식으로 작성하면 왼쪽에 상황명이 붙습니다.
        </p>
        {renderDialogueSection('5.1', '요원 선택', [agentQuote])}
        {renderDialogueSection('5.2', '구매단계', data.buyPhaseQuotes)}
        {renderDialogueSection('5.3', '라운드 진행 시', data.roundQuotes)}
        {renderDialogueSection('5.4', '특정 요원과의 상호작용', data.interactionQuotes, '아직 작성된 상호작용 대사가 없습니다.')}
        {renderDialogueSection('5.5', '처치 시', data.killQuotes)}
      </section>

      <section className="agent-lore-section" id="agent-section-6">
        <div className="wiki-card agent-lore-card">
          <div className="sidebar-title" style={{ fontSize: '16px' }}>
            <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            6. 요원 공식 배경 (Agent Lore)
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
            {data.lore}
          </p>
        </div>
      </section>

      <section className="fade-letter-card" id="agent-section-7">
        <div className="fade-letter-portrait">
          <img src={fadeLetter.image} alt={`${data.nameKr} 페이드 협박편지 이미지`} />
          <div className="fade-letter-meta">
            <strong>콜사인 / {fadeLetter.callsign}</strong>
            <strong>이름 / {fadeLetter.name}</strong>
            <strong>분류 / {fadeLetter.classification}</strong>
          </div>
        </div>
        <div className="fade-letter-content">
          <div className="sidebar-title" style={{ fontSize: '16px', marginBottom: '12px' }}>
            <ScrollText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            7. 페이드의 협박편지
          </div>
          {fadeLetter.content.split('\n').map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
};
