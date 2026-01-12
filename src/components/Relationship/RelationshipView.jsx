import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Network, Pencil, PlusCircle, GitMerge, Search } from 'lucide-react';
import classNames from 'classnames';

const RelationshipView = () => {
    const { activeCategoryId, relationshipDictionary } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [mergingItem, setMergingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const data = relationshipDictionary || [];

    // Determine max chunk count for relative bar width
    const maxChunkCount = Math.max(...data.map(item => item.chunk_count || 0), 10);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleMergeClick = (item) => {
        setMergingItem(item);
        setIsMergeModalOpen(true);
        setSearchTerm("");
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
            <div className="h-full flex items-center justify-center text-gray-400">
                <p>좌측 메뉴에서 카테고리를 선택하세요</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <Network size={48} className="opacity-20" />
                <p>이 카테고리에는 관계 정의 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">관계사전 (Relationship Dictionary)</h2>
                <div className="text-sm text-gray-500">
                    {data.length} 개 관계 유형
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left text-sm text-gray-700 table-fixed">
                    <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-normal w-[20%]">용어(KR)</th>
                            <th className="px-6 py-3 font-normal w-[20%]">용어(EN)</th>
                            <th className="px-6 py-3 font-normal w-[35%]">설명</th>
                            <th className="px-6 py-3 font-normal w-[15%]">청크 수</th>
                            <th className="px-6 py-3 font-normal w-[10%] text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 align-top font-bold text-gray-900 break-words">
                                    {item.term_kr}
                                </td>
                                <td className="px-6 py-4 align-top text-gray-600 break-words">
                                    {item.term_en}
                                </td>
                                <td className="px-6 py-4 align-top text-gray-600 leading-relaxed text-xs">
                                    <p className="line-clamp-2" title={item.description}>{item.description}</p>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-400 rounded-full"
                                                style={{ width: `${(item.chunk_count / maxChunkCount) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 w-4 text-right">{item.chunk_count || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-middle text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="수정"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleMergeClick(item)}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="병합(이동)"
                                        >
                                            <GitMerge size={14} />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="추가"
                                        >
                                            <PlusCircle size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
