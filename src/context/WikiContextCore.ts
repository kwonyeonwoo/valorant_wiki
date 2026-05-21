import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AgentData, Article } from '../data/initialArticles';

export type ViewMode = 'read' | 'edit' | 'history' | 'wizard';

export interface Revision {
  version: number;
  content: string;
  timestamp: string;
  comment: string;
  author: string;
}

export interface WikiContextType {
  articles: Record<string, Article>;
  history: Record<string, Revision[]>;
  activePage: string;
  viewMode: ViewMode;
  isAgentView: boolean;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  setIsAgentView: Dispatch<SetStateAction<boolean>>;
  navigateToPage: (title: string) => void;
  saveArticle: (
    title: string,
    content: string,
    category: Article['category'],
    comment: string,
    agentData?: AgentData
  ) => void;
  deleteArticle: (title: string) => void;
  rollbackToVersion: (title: string, version: number) => void;
  recentChanges: Array<{ title: string; updatedAt: string; comment: string; author: string; version: number }>;
}

export const WikiContext = createContext<WikiContextType | undefined>(undefined);
