import React from 'react';
import { WikiProvider } from './context/WikiContext';
import { useWiki } from './context/useWiki';
import { WikiLayout } from './components/WikiLayout';
import { WikiReader } from './components/WikiReader';
import { WikiEditor } from './components/WikiEditor';
import { WikiHistory } from './components/WikiHistory';
import { AgentWizard } from './components/AgentWizard';

const AppContent: React.FC = () => {
  const { viewMode } = useWiki();

  const renderContent = () => {
    switch (viewMode) {
      case 'read':
        return <WikiReader />;
      case 'edit':
        return <WikiEditor />;
      case 'history':
        return <WikiHistory />;
      case 'wizard':
        return <AgentWizard />;
      default:
        return <WikiReader />;
    }
  };

  return <WikiLayout>{renderContent()}</WikiLayout>;
};

function App() {
  return (
    <WikiProvider>
      <AppContent />
    </WikiProvider>
  );
}

export default App;
