import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Network, Pencil, PlusCircle, GitMerge, Search, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import classNames from 'classnames';
import ChunkViewer from '../Dictionary/ChunkViewer';
import GraphVisualizer from './GraphVisualizer';

const RelationshipView = () => {
    const { activeCategoryId, relationshipDictionary, knTypeData } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [mergingItem, setMergingItem] = useState(null);
    const [mergeSearchTerm, setMergeSearchTerm] = useState("");
    const [listSearchTerm, setListSearchTerm] = useState("");

    const [selectedTerm, setSelectedTerm] = useState(null);
    const [activeTab, setActiveTab] = useState('doc'); // 'doc' or 'graph'
    const [isDetailOpen, setIsDetailOpen] = useState(true);

    const data = relationshipDictionary || [];

    // Filter displayed data based on list search term
    const filteredData = data.filter(item =>
        item.term_kr.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        item.term_en.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(listSearchTerm.toLowerCase()))
    );

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleMergeClick = (item) => {
        setMergingItem(item);
        setIsMergeModalOpen(true);
        setMergeSearchTerm("");
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

    const closeMergeModal = () => {
        setIsMergeModalOpen(false);
        setMergingItem(null);
    };

    // Filter available targets for merge (excluding self)
    const mergeTargets = data.filter(item => item.term_kr !== mergingItem?.term_kr);

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

    if (data.length === 0) {
        return (
            <div className="h-full w-full">
                <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">관계사전 (Relationship Dictionary)</h2>
                </div>
                <div className="flex-1 h-[calc(100%-3.5rem)] flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Network size={48} className="opacity-20" />
                    <p>이 카테고리에는 관계 정의 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Term List */}
                <div className={`flex-1 border-r border-gray-200 flex flex-col bg-white transition-all duration-300 ease-in-out`}>
                    <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">관계사전 (Relationship Dictionary)</h2>
                        <div className="text-sm text-gray-500">
                            {data.length} 개 관계 유형
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-white flex flex-col">
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 flex items-center min-h-[48px] gap-2 shrink-0">
                            <div className="relative flex-1 max-w-sm">
                                <input
                                    type="text"
                                    placeholder="관계 검색 (용어, 설명)..."
                                    value={listSearchTerm}
                                    onChange={(e) => {
                                        setListSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-3 py-1.5 pl-9 text-sm focus:border-primary focus:outline-none"
                                />
                                <Search className="absolute left-3 top-2 text-gray-400" size={14} />
                            </div>
                            {!isDetailOpen && selectedTerm && (
                                <button
                                    onClick={() => setIsDetailOpen(true)}
                                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
                                    title="상세정보 펼치기"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left text-sm text-gray-700 table-fixed">
                                <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 font-normal w-[20%]">용어</th>
                                        <th className="px-4 py-2 font-normal w-[40%]">설명</th>
                                        <th className="px-4 py-2 font-normal w-[12%] text-center">청크 수</th>
                                        <th className="px-4 py-2 font-normal w-[10%] text-center">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={classNames(
                                                "hover:bg-gray-50 transition-colors group cursor-pointer h-10",
                                                selectedTerm?.term_kr === item.term_kr ? "bg-blue-50" : ""
                                            )}
                                            onClick={() => {
                                                setSelectedTerm(item);
                                                setIsDetailOpen(true);
                                            }}
                                        >
                                            <td className="px-4 py-1 align-middle text-gray-900 truncate">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm truncate" title={item.term_kr}>{item.term_kr}</span>
                                                    <span className="text-xs text-gray-400 truncate hidden xl:inline" title={item.term_en}>({item.term_en})</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-1 align-middle text-gray-600 text-xs">
                                                <p className="truncate" title={item.description}>{item.description}</p>
                                            </td>
                                            <td className="px-4 py-1 align-middle text-center">
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {item.chunk_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-1 align-middle text-center">
                                                <div className="flex items-center justify-center gap-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                                                        className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                                        title="수정"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleMergeClick(item); }}
                                                        className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                                        title="병합(이동)"
                                                    >
                                                        <GitMerge size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1 py-2 border-t border-gray-200 bg-gray-50 shrink-0">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium transition-colors ${currentPage === page
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent rotate-180"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Tabs and Content */}
                <div className={classNames(
                    "flex flex-col bg-gray-50 transition-all duration-300 ease-in-out border-l border-gray-200 overflow-hidden shrink-0",
                    isDetailOpen ? "w-1/3 opacity-100" : "w-0 opacity-0"
                )}>
                    {selectedTerm ? (
                        <>
                            {/* Tab Header */}
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
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                    title="상세정보 접기"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden relative">
                                {activeTab === 'doc' ? (
                                    <ChunkViewer
                                        selectedTerm={selectedTerm}
                                        onClose={() => setIsDetailOpen(false)}
                                        mode="embedded"
                                    />
                                ) : (
                                    knTypeData && (
                                        <GraphVisualizer
                                            data={knTypeData}
                                            centerNode={selectedTerm.term_kr}
                                        />
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p className="text-lg font-medium text-gray-500">용어를 선택하세요</p>
                            <p className="text-sm text-gray-400 mt-2">좌측 목록에서 용어를 선택하면 상세 정보를 볼 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal Mockup */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">관계 수정 (Mockup)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">용어(KR)</label>
                                <input type="text" defaultValue={editingItem?.term_kr} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">용어(EN)</label>
                                <input type="text" defaultValue={editingItem?.term_en} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">설명</label>
                                <textarea defaultValue={editingItem?.description} className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none focus:border-primary focus:outline-none" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={closeEditModal} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded">취소</button>
                            <button onClick={closeEditModal} className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Merge Modal Mockup */}
            {isMergeModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">관계 이동 (병합)</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            '{mergingItem?.term_kr}' 관계를 다른 관계로 이동(병합)합니다.<br />
                            이동 후 원본 관계는 삭제되며, 모든 문서 출처와 관계가 대상 관계로 이전됩니다.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-2">이동할 대상 검색</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="대상 검색..."
                                        value={mergeSearchTerm}
                                        onChange={(e) => setMergeSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 pl-9 text-sm focus:border-primary focus:outline-none"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-md h-48 overflow-y-auto">
                                <ul className="divide-y divide-gray-100">
                                    {mergeTargets.map((target, idx) => (
                                        <li key={idx} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 group">
                                            <span className="flex-shrink-0 px-1.5 py-0.5 border border-gray-300 rounded text-[10px] text-gray-500 font-medium">
                                                Causal
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{target.term_kr}</p>
                                                <p className="text-xs text-gray-500 truncate">{target.term_en}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="addSynonym" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                                <label htmlFor="addSynonym" className="text-sm text-gray-700 cursor-pointer select-none">원본 용어를 유의어로 추가 (병합 후 검색 가능)</label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={closeMergeModal} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 rounded">취소</button>
                            <button onClick={closeMergeModal} className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">이동</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default RelationshipView;
