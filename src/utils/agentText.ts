import type { Relationship } from '../data/initialArticles';

export const linesToText = (lines?: string[]) => (lines || []).join('\n');

export const textToLines = (value: string) =>
  value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

export const relationshipsToText = (relationships?: Relationship[]) =>
  (relationships || [])
    .map(item => `${item.agent} | ${item.description}`)
    .join('\n');

export const textToRelationships = (value: string): Relationship[] =>
  value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [agent, ...descriptionParts] = line.split('|').map(part => part.trim());
      return {
        agent: agent || '미지의 요원',
        description: descriptionParts.join(' | ') || '관계 설명이 아직 작성되지 않았습니다.'
      };
    });
