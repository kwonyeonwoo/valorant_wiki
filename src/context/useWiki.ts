import { useContext } from 'react';
import { WikiContext } from './WikiContextCore';

export const useWiki = () => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error('useWiki must be used within a WikiProvider');
  }
  return context;
};
