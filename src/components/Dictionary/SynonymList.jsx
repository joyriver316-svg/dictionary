import React, { useState } from 'react';
import { Pencil, PlusCircle, Trash2, ArrowRight, GitMerge, Search, ChevronLeft } from 'lucide-react';
import useStore from '../../store/useStore';

const SynonymList = (props) => {
    const { data, onChunkClick, showExpandButton, onExpand } = props;
    const { dictionaryData } = useStore(); // Access full data for merge targets
    const mergedProps = props;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [mergingItem, setMergingItem] = useState(null);

    const [mergeSearchTerm, setMergeSearchTerm] = useState("");
    const [listSearchTerm, setListSearchTerm] = useState("");

    // Filter displayed data based on list search term
    const filteredData = data.filter(item =>
        item.term_kr.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        item.term_en.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(listSearchTerm.toLowerCase()))
    );

    const maxChunkCount = 200;

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
    // Using dictionaryData from store to show all potential targets in the category
    const mergeTargets = (dictionaryData || []).filter(item => item.term_kr !== mergingItem?.term_kr);

    // Filter targets based on search term
    const filteredTargets = mergeTargets.filter(item =>
        item.term_kr.toLowerCase().includes(mergeSearchTerm.toLowerCase()) ||
        item.term_en.toLowerCase().includes(mergeSearchTerm.toLowerCase())
    );

    if (data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <p>이 카테고리에는 개념 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-auto bg-white">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 flex items-center min-h-[48px] gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder="개념 검색 (용어, 설명)..."
                            value={listSearchTerm}
                            onChange={(e) => setListSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 pl-9 text-sm focus:border-primary focus:outline-none"
                        />
                        <Search className="absolute left-3 top-2 text-gray-400" size={14} />
                    </div>
                    {showExpandButton && (
                        <button
                            onClick={onExpand}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
                            title="상세정보 펼치기"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                </div>
                <table className="w-full text-left text-sm text-gray-700 table-fixed">
                    <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-[53px] z-10 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-normal w-[18%]">용어</th>
                            <th className="px-6 py-3 font-normal w-[20%]">설명</th>
                            <th className="px-6 py-3 font-normal w-[40%]">유의어</th>
                            <th className="px-6 py-3 font-normal w-[12%] text-center">청크 수</th>
                            <th className="px-6 py-3 font-normal w-[10%] text-center">관리</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-blue-50 transition-colors group cursor-pointer ${(item.term_kr === (mergedProps.selectedTerm?.term_kr) && item.term_en === (mergedProps.selectedTerm?.term_en)) ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => mergedProps.onTermSelect && mergedProps.onTermSelect(item)}
                            >
                                <td className="px-6 py-2 align-top text-gray-900 break-words">
                                    <div className="font-bold text-sm">{item.term_kr}</div>
                                    <div className="text-xs text-gray-500">{item.term_en}</div>
                                </td>
                                <td className="px-6 py-2 align-top text-gray-600 leading-relaxed text-xs">
                                    <p className="line-clamp-2" title={item.description}>{item.description}</p>
                                </td>
                                <td className="px-6 py-2 align-top">
                                    <div className="text-gray-400 italic text-xs break-words">
                                        {item.synonyms?.join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-2 align-middle text-center">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {item.chunk_count || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-2 align-middle text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="수정"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMergeClick(item); }}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="개념 이동(병합)"
                                        >
                                            <GitMerge size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {/* Edit Modal Mockup */}
            {
                isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">개념 수정 (Mockup)</h3>
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
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">유의어 (콤마로 구분)</label>
                                    <input type="text" defaultValue={editingItem?.synonyms?.join(', ')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button onClick={closeEditModal} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded">취소</button>
                                <button onClick={closeEditModal} className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-700">저장</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Merge Modal Mockup */}
            {
                isMergeModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">개념 이동 (병합)</h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                '{mergingItem?.term_kr}' 개념을 다른 개념으로 이동(병합)합니다.<br />
                                이동 후 원본 개념은 삭제되며, 모든 문서 출처와 관계가 대상 개념으로 이전됩니다.
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
                                        {filteredTargets.map((target, idx) => (
                                            <li key={idx} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 group">
                                                <span className="flex-shrink-0 px-1.5 py-0.5 border border-gray-300 rounded text-[10px] text-gray-500 font-medium">
                                                    Indicator
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{target.term_kr}</p>
                                                    <p className="text-xs text-gray-500 truncate">{target.term_en}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {filteredTargets.length === 0 && (
                                            <li className="px-4 py-8 text-center text-xs text-gray-400">
                                                검색 결과가 없습니다.
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="addSynonymConcept" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                                    <label htmlFor="addSynonymConcept" className="text-sm text-gray-700 cursor-pointer select-none">원본 용어를 유의어로 추가 (병합 후 검색 가능)</label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <button onClick={closeMergeModal} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 rounded">취소</button>
                                <button onClick={closeMergeModal} className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">이동</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default SynonymList;
