import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import SynonymList from './SynonymList';
import ChunkViewer from './ChunkViewer';
import GraphVisualizer from '../Relationship/GraphVisualizer';
import { FileText, Network, ChevronRight, ChevronLeft } from 'lucide-react';
import classNames from 'classnames';

const DictionaryView = () => {
    const { dictionaryData, activeCategoryId, knTypeData } = useStore();
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [activeTab, setActiveTab] = useState('doc'); // 'doc' or 'graph'
    const [isDetailOpen, setIsDetailOpen] = useState(true);

    if (!activeCategoryId) {
        return (
            <div className="h-full flex flex-col p-6">
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg font-medium">좌측 메뉴에서 카테고리를 선택하세요</p>
                    </div>
                </div>
            </div>
        );
    }

    if (dictionaryData.length === 0) {
        return (
            <div className="h-full w-full">
                <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">개념사전 (Concept Dictionary)</h2>
                </div>
                <div className="flex-1 h-[calc(100%-3.5rem)] flex items-center justify-center text-gray-400">
                    <p>이 카테고리에는 사전 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Pane: Term List */}
                <div className={`flex-1 border-r border-gray-200 flex flex-col bg-white transition-all duration-300 ease-in-out`}>
                    <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">개념사전 (Concept Dictionary)</h2>
                        <div className="text-sm text-gray-500">
                            {dictionaryData?.length || 0} 개 용어
                        </div>
                    </div>
                    <SynonymList
                        data={dictionaryData}
                        onTermSelect={(term) => {
                            setSelectedTerm(term);
                            setIsDetailOpen(true);
                        }}
                        selectedTerm={selectedTerm}
                        showExpandButton={!isDetailOpen && selectedTerm}
                        onExpand={() => setIsDetailOpen(true)}
                    />
                </div>

                {/* Right Pane: Tabs and Content */}
                <div
                    className={classNames(
                        "flex flex-col bg-gray-50 border-l border-gray-200 transition-all duration-300 ease-in-out overflow-hidden relative shrink-0",
                        isDetailOpen ? "w-1/3 opacity-100" : "w-0 opacity-0 border-none"
                    )}
                >
                    {selectedTerm ? (
                        <>
                            {/* Tabs Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 bg-white h-14 flex-shrink-0">
                                <div className="flex h-full">
                                    <button
                                        onClick={() => setActiveTab('doc')}
                                        className={classNames(
                                            "px-4 h-full flex items-center gap-2 text-sm font-medium transition-colors border-b-2",
                                            activeTab === 'doc'
                                                ? "border-blue-500 text-blue-600 bg-blue-50/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        <FileText size={16} />
                                        문서
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('graph')}
                                        className={classNames(
                                            "px-4 h-full flex items-center gap-2 text-sm font-medium transition-colors border-b-2",
                                            activeTab === 'graph'
                                                ? "border-blue-500 text-blue-600 bg-blue-50/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        <Network size={16} />
                                        그래프
                                    </button>
                                </div>

                                {/* Collapse Button */}
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                    title="상세정보 접기"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-hidden relative">
                                {activeTab === 'doc' && (
                                    <ChunkViewer selectedTerm={selectedTerm} mode="embedded" />
                                )}
                                {activeTab === 'graph' && (
                                    <div className="w-full h-full p-4">
                                        {knTypeData && knTypeData.length > 0 ? (
                                            <GraphVisualizer
                                                relationships={knTypeData}
                                                centerNode={selectedTerm?.term_kr}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                <Network size={48} className="opacity-20 mb-2" />
                                                <p>연관된 그래프 데이터가 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p className="text-lg font-medium text-gray-500">용어를 선택하세요</p>
                            <p className="text-sm">좌측 목록에서 용어를 선택하면 상세 정보를 볼 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DictionaryView;
