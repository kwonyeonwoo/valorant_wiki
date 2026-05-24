import React, { useState, useEffect } from 'react';
import { initialArticles } from '../data/initialArticles';
import type { AgentData, Article } from '../data/initialArticles';
import { WikiContext } from './WikiContextCore';
import type { Revision, ViewMode, DbStatus } from './WikiContextCore';
import { isSupabaseReady } from '../lib/supabase';
import { fetchAllArticles, upsertArticle, removeArticle } from '../lib/supabaseApi';

interface WikiState {
  articles: Record<string, Article>;
  history: Record<string, Revision[]>;
}

const DEPRECATED_HOME_MARKER = '금주의 추천 창작 요원';

const createInitialHistory = (): Record<string, Revision[]> => {
  const initialHistory: Record<string, Revision[]> = {};

  Object.keys(initialArticles).forEach((title) => {
    initialHistory[title] = [
      {
        version: 1,
        content: initialArticles[title].content,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        comment: '최초 문서 생성 및 뼈대 작성',
        author: 'SystemCoder',
      },
    ];

    if (title === '빛샘') {
      initialHistory[title].push({
        version: 2,
        content: initialArticles[title].content,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        comment: '스킬명 수정 및 활용 팁 상세 보강',
        author: 'ValoBalancer',
      });
    } else if (title === '해저드') {
      initialHistory[title].push({
        version: 2,
        content: initialArticles[title].content,
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        comment: '궁극기 디케이 돔(X) 데미지 밸런스 패치',
        author: 'ToxicWarden',
      });
    }
  });

  return initialHistory;
};

const loadWikiState = (): WikiState => {
  const initialState = {
    articles: initialArticles,
    history: createInitialHistory(),
  };

  try {
    const savedArticles = localStorage.getItem('valowiki_articles');
    const savedHistory = localStorage.getItem('valowiki_history');

    if (savedArticles && savedHistory) {
      const parsedArticles = JSON.parse(savedArticles) as Record<string, Article>;

      // --- migrations ---
      Object.keys(parsedArticles).forEach((title) => {
        const savedAgentData = parsedArticles[title].agentData;
        const initialAgentData = initialArticles[title]?.agentData;

        if (savedAgentData && !savedAgentData.quote && initialAgentData?.quote) {
          savedAgentData.quote = initialAgentData.quote;
        }
        if (savedAgentData && !savedAgentData.signatureColor) {
          savedAgentData.signatureColor = initialAgentData?.signatureColor || '#ff4655';
        }
      });

      // Remove deprecated '금주의 추천 창작 요원' section from 대문
      if (parsedArticles['대문']?.content.includes(DEPRECATED_HOME_MARKER)) {
        parsedArticles['대문'] = {
          ...parsedArticles['대문'],
          content: initialArticles['대문'].content,
        };
      }

      // Remove built-in example agents (빛샘, 해저드) from local cache
      const REMOVED_EXAMPLES = ['빛샘', '해저드'];
      const parsedHistory = JSON.parse(savedHistory) as Record<string, Revision[]>;
      REMOVED_EXAMPLES.forEach((title) => {
        delete parsedArticles[title];
        delete parsedHistory[title];
      });

      return {
        articles: parsedArticles,
        history: parsedHistory,
      };
    }

    localStorage.setItem('valowiki_articles', JSON.stringify(initialState.articles));
    localStorage.setItem('valowiki_history', JSON.stringify(initialState.history));
  } catch {
    return initialState;
  }

  return initialState;
};

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialWikiState] = useState(loadWikiState);
  const [articles, setArticles] = useState<Record<string, Article>>(initialWikiState.articles);
  const [history, setHistory] = useState<Record<string, Revision[]>>(initialWikiState.history);
  const [activePage, setActivePage] = useState<string>('대문');
  const [viewMode, setViewMode] = useState<ViewMode>('read');
  const [isAgentView, setIsAgentView] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DbStatus>('initializing');

  // Sync with Supabase on mount
  useEffect(() => {
    if (!isSupabaseReady()) {
      setDbStatus('offline');
      return;
    }

    const sync = async () => {
      try {
        const remote = await fetchAllArticles();

        if (remote === null) {
          setDbStatus('offline');
          return;
        }

        if (Object.keys(remote).length === 0) {
          // DB is empty — seed it with current local data
          const localArticles = loadWikiState().articles;
          await Promise.all(Object.values(localArticles).map(upsertArticle));
        } else {
          // Use remote data; restore any local data: URL images that weren't synced to DB
          const keepLocal = (remote: string | undefined, local: string | undefined) =>
            !remote && local?.startsWith('data:') ? local : remote;

          const merged: Record<string, Article> = {};
          for (const [title, remoteArticle] of Object.entries(remote)) {
            const localAD = initialWikiState.articles[title]?.agentData;
            const remoteAD = remoteArticle.agentData;
            if (remoteAD && localAD) {
              merged[title] = {
                ...remoteArticle,
                agentData: {
                  ...remoteAD,
                  portrait: keepLocal(remoteAD.portrait, localAD.portrait) ?? '',
                  abilities: remoteAD.abilities.map((a, i) => ({
                    ...a,
                    image: keepLocal(a.image, localAD.abilities[i]?.image),
                  })),
                  fadeLetter: remoteAD.fadeLetter && localAD.fadeLetter
                    ? {
                        ...remoteAD.fadeLetter,
                        image: keepLocal(remoteAD.fadeLetter.image, localAD.fadeLetter.image) ?? '',
                      }
                    : remoteAD.fadeLetter,
                },
              };
            } else {
              merged[title] = remoteArticle;
            }
          }
          setArticles(merged);
          localStorage.setItem('valowiki_articles', JSON.stringify(merged));
        }

        setDbStatus('connected');
      } catch (err) {
        console.error('[Supabase] sync error:', err);
        setDbStatus('offline');
      }
    };

    sync();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward based on hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/wiki/')) {
        const pageTitle = decodeURIComponent(hash.substring(7));
        setActivePage(pageTitle);
        setViewMode('read');
      } else if (hash === '#/wizard') {
        setViewMode('wizard');
      } else {
        setActivePage('대문');
        setViewMode('read');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (title: string) => {
    if (title === 'wizard') {
      window.location.hash = '#/wizard';
      setViewMode('wizard');
    } else {
      window.location.hash = `#/wiki/${encodeURIComponent(title)}`;
      setActivePage(title);
      setViewMode('read');
    }
  };

  const saveArticle = (
    title: string,
    content: string,
    category: Article['category'],
    comment: string,
    agentData?: AgentData
  ) => {
    const isNew = !articles[title];
    const now = new Date().toISOString();

    const updatedArticle: Article = {
      title,
      category,
      content,
      updatedAt: now,
      agentData: agentData || articles[title]?.agentData,
    };

    const updatedArticles = { ...articles, [title]: updatedArticle };

    const newRevision: Revision = {
      version: isNew ? 1 : (history[title]?.[history[title].length - 1]?.version || 0) + 1,
      content,
      timestamp: now,
      comment: comment || (isNew ? '최초 문서 작성' : '문서 편집'),
      author: '방문자 (Guest)',
    };

    const updatedHistory = {
      ...history,
      [title]: [...(history[title] || []), newRevision],
    };

    setArticles(updatedArticles);
    setHistory(updatedHistory);

    localStorage.setItem('valowiki_articles', JSON.stringify(updatedArticles));
    localStorage.setItem('valowiki_history', JSON.stringify(updatedHistory));

    // Persist to Supabase (fire-and-forget)
    upsertArticle(updatedArticle).catch(console.error);

    navigateToPage(title);
  };

  const deleteArticle = (title: string) => {
    if (title === '대문') return;

    const updatedArticles = { ...articles };
    delete updatedArticles[title];

    const updatedHistory = { ...history };
    delete updatedHistory[title];

    setArticles(updatedArticles);
    setHistory(updatedHistory);

    localStorage.setItem('valowiki_articles', JSON.stringify(updatedArticles));
    localStorage.setItem('valowiki_history', JSON.stringify(updatedHistory));

    // Remove from Supabase (fire-and-forget)
    removeArticle(title).catch(console.error);

    navigateToPage('대문');
  };

  const rollbackToVersion = (title: string, versionNumber: number) => {
    const revisions = history[title];
    if (!revisions) return;

    const targetRev = revisions.find((r) => r.version === versionNumber);
    if (!targetRev) return;

    const now = new Date().toISOString();
    const currentVer = revisions[revisions.length - 1].version;

    const updatedArticle: Article = {
      ...articles[title],
      content: targetRev.content,
      updatedAt: now,
    };

    const updatedArticles = { ...articles, [title]: updatedArticle };

    const rollbackRevision: Revision = {
      version: currentVer + 1,
      content: targetRev.content,
      timestamp: now,
      comment: `r${versionNumber} 버전으로 되돌림 (수정자: 방랑자)`,
      author: '위키 수호자',
    };

    const updatedHistory = {
      ...history,
      [title]: [...revisions, rollbackRevision],
    };

    setArticles(updatedArticles);
    setHistory(updatedHistory);

    localStorage.setItem('valowiki_articles', JSON.stringify(updatedArticles));
    localStorage.setItem('valowiki_history', JSON.stringify(updatedHistory));

    upsertArticle(updatedArticle).catch(console.error);

    setViewMode('read');
  };

  const recentChanges = React.useMemo(() => {
    const list: Array<{
      title: string;
      updatedAt: string;
      comment: string;
      author: string;
      version: number;
    }> = [];

    Object.keys(history).forEach((title) => {
      const revs = history[title];
      if (revs && revs.length > 0) {
        const latest = revs[revs.length - 1];
        list.push({
          title,
          updatedAt: latest.timestamp,
          comment: latest.comment,
          author: latest.author,
          version: latest.version,
        });
      }
    });

    return list.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [history]);

  return (
    <WikiContext.Provider
      value={{
        articles,
        history,
        activePage,
        viewMode,
        isAgentView,
        setViewMode,
        setIsAgentView,
        navigateToPage,
        saveArticle,
        deleteArticle,
        rollbackToVersion,
        recentChanges,
        dbStatus,
      }}
    >
      {children}
    </WikiContext.Provider>
  );
};
