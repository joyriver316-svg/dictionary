import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import DictionaryView from './components/Dictionary/DictionaryView';
import RelationshipView from './components/Relationship/RelationshipView';
import KNTypeView from './components/KNType/KNTypeView';
import useStore from './store/useStore';
import classNames from 'classnames';

function App() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <MainLayout>
      {/* Tab Navigation Area */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={classNames(
              "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
              activeTab === 'dictionary'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            개념사전 (Concept Dictionary)
          </button>
          <button
            onClick={() => setActiveTab('relationship')}
            className={classNames(
              "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
              activeTab === 'relationship'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            관계사전 (Relationship Dictionary)
          </button>
          <button
            onClick={() => setActiveTab('kn_type')}
            className={classNames(
              "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
              activeTab === 'kn_type'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            놀런타입 (KN Type)
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'dictionary' ? (
          <DictionaryView />
        ) : activeTab === 'relationship' ? (
          <RelationshipView />
        ) : (
          <KNTypeView />
        )}
      </div>
    </MainLayout>
  );
}

export default App;
