import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import DictionaryView from './components/Dictionary/DictionaryView';
import RelationshipView from './components/Relationship/RelationshipView';
import KNTypeView from './components/KNType/KNTypeView';
import LoginView from './components/Auth/LoginView';
import SettingsView from './components/Settings/SettingsView';
import useStore from './store/useStore';

function App() {
  const { activeTab, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <MainLayout>
      {/* Content Area - Now just switches views based on store state */}
      <div className="flex-1 overflow-hidden h-full">
        {activeTab === 'dictionary' ? (
          <DictionaryView />
        ) : activeTab === 'relationship' ? (
          <RelationshipView />
        ) : activeTab === 'kn_type' ? (
          <KNTypeView />
        ) : (
          <SettingsView />
        )}
      </div>
    </MainLayout>
  );
}

export default App;
