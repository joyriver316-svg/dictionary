import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Network, Pencil, PlusCircle, Maximize2, Search } from 'lucide-react';
import ChunkViewer from '../Dictionary/ChunkViewer';
import classNames from 'classnames';

const KNTypeView = () => {
    const { activeCategoryId, knTypeData } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [selectedChunkItem, setSelectedChunkItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const data = knTypeData || [];

    // Filter displayed data based on search term
    const filteredData = data.filter(item =>
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.object.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fixed max chunk count for relative bar width as requested
    const maxChunkCount = 500;

    const handleEditClick = (e, item) => {
        e.stopPropagation();
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleRowClick = (item) => {
        // Adapt KN Type item to ChunkViewer expected format
        const adaptedItem = {
            ...item,
            term_kr: `${item.subject} - ${item.relation} - ${item.object}`, // Composite title for viewer
            term_en: 'KN Type Relation',
            description: 'Triple Relationship'
        };
        setSelectedChunkItem(adaptedItem);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

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
                    <h2 className="text-lg font-semibold text-gray-800">놀런타입 (KN Type)</h2>
                </div>
                <div className="flex-1 h-[calc(100%-3.5rem)] flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Network size={48} className="opacity-20" />
                    <p>이 카테고리에는 놀런타입 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex">
            {/* Main Table Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">놀런타입 (KN Type)</h2>
                    <div className="text-sm text-gray-500">
                        {data.length} 개 타입 정의
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-white">
                    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-2">
                        <div className="relative max-w-sm">
                            <input
                                type="text"
                                placeholder="트리플 검색 (주어, 관계, 목적어)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 pl-9 text-sm focus:border-primary focus:outline-none"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm text-gray-700 table-fixed">
                        <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-[53px] z-10 border-b border-gray-200">
                            <tr>
                                {/* Reduced spacing/width as requested */}
                                <th className="px-3 py-3 font-normal w-[20%]">주어 (Subject)</th>
                                <th className="px-3 py-3 font-normal w-[20%]">관계 (Relation)</th>
                                <th className="px-3 py-3 font-normal w-[20%]">목적어 (Object)</th>
                                <th className="px-3 py-3 font-normal w-[15%]">청크 수</th>
                                <th className="px-3 py-3 font-normal w-[10%] text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className={classNames(
                                        "hover:bg-blue-50 transition-colors cursor-pointer group",
                                        selectedChunkItem?.subject === item.subject && selectedChunkItem?.object === item.object ? "bg-blue-50" : ""
                                    )}
                                    onClick={() => handleRowClick(item)}
                                >
                                    <td className="px-3 py-3 align-top font-bold text-gray-900 break-words truncate">
                                        <span title={item.subject}>{item.subject}</span>
                                    </td>
                                    <td className="px-3 py-3 align-top text-gray-600 break-words">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200 inline-block max-w-full truncate" title={item.relation}>
                                            {item.relation}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 align-top font-bold text-gray-900 break-words truncate">
                                        <span title={item.object}>{item.object}</span>
                                    </td>
                                    <td className="px-3 py-3 align-middle">
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
                                    <td className="px-3 py-3 align-middle text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleEditClick(e, item)}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                                title="수정"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
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
            </div>

            {/* Chunk Viewer Sidebar */}
            <ChunkViewer selectedTerm={selectedChunkItem} onClose={() => setSelectedChunkItem(null)} />

            {/* Edit Modal Mockup */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">타입 수정 (Mockup)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">주어 (Subject)</label>
                                <input type="text" defaultValue={editingItem?.subject} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">관계 (Relation)</label>
                                <input type="text" defaultValue={editingItem?.relation} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">목적어 (Object)</label>
                                <input type="text" defaultValue={editingItem?.object} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={closeEditModal} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded">취소</button>
                            <button onClick={closeEditModal} className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-700">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KNTypeView;
