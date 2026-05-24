import { supabase } from './supabase';
import type { Article } from '../data/initialArticles';

// Supabase row shape (snake_case, updated_at instead of updatedAt)
interface ArticleRow {
  title: string;
  category: string;
  content: string;
  updated_at: string;
  agent_data: Article['agentData'] | null;
}

const rowToArticle = (row: ArticleRow): Article => ({
  title: row.title,
  category: row.category as Article['category'],
  content: row.content,
  updatedAt: row.updated_at,
  agentData: row.agent_data ?? undefined,
});

export const fetchAllArticles = async (): Promise<Record<string, Article> | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase.from('articles').select('*');
  if (error) {
    console.error('[Supabase] fetch error:', error.message);
    return null;
  }

  const result: Record<string, Article> = {};
  for (const row of data as ArticleRow[]) {
    result[row.title] = rowToArticle(row);
  }
  return result;
};

// Strip data: URLs before storing — large blobs belong in Cloudinary, not in Supabase JSONB
const sanitizeAgentData = (agentData: Article['agentData']): Article['agentData'] => {
  if (!agentData) return agentData;
  const strip = (s: string | undefined) => (s?.startsWith('data:') ? '' : s);
  return {
    ...agentData,
    portrait: strip(agentData.portrait) ?? '',
    abilities: agentData.abilities.map(a => ({ ...a, image: strip(a.image) })),
    fadeLetter: agentData.fadeLetter
      ? { ...agentData.fadeLetter, image: strip(agentData.fadeLetter.image) ?? '' }
      : undefined,
  };
};

export const upsertArticle = async (article: Article): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase.from('articles').upsert(
    {
      title: article.title,
      category: article.category,
      content: article.content,
      updated_at: article.updatedAt,
      agent_data: sanitizeAgentData(article.agentData) ?? null,
    },
    { onConflict: 'title' }
  );
  if (error) console.error('[Supabase] upsert error:', error.message);
};

export const removeArticle = async (title: string): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase.from('articles').delete().eq('title', title);
  if (error) console.error('[Supabase] delete error:', error.message);
};
