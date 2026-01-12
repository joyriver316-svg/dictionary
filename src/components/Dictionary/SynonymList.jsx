import React, { useState } from 'react';
import { Pencil, PlusCircle } from 'lucide-react';
import ChunkViewer from './ChunkViewer';

const SynonymList = ({ data }) => {
    const [selectedChunk, setSelectedChunk] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Determine max chunk count for relative bar width
    const maxChunkCount = Math.max(...data.map(item => item.chunk_count || 0), 10);

    const handleRowClick = (item) => {
        setSelectedChunk(item);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
        setSelectedChunk(null);
    };

    const handleEditClick = (e, item) => {
        e.stopPropagation(); // Prevent row click
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="relative h-full flex flex-col">
            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left text-sm text-gray-700 table-fixed">
                    <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-normal w-[12%]">용어(KR)</th>
                            <th className="px-4 py-3 font-normal w-[12%]">용어(EN)</th>
                            <th className="px-4 py-3 font-normal w-[20%]">설명</th>
                            <th className="px-4 py-3 font-normal w-[36%]">유의어</th>
                            <th className="px-4 py-3 font-normal w-[10%]">청크 수</th>
                            <th className="px-4 py-3 font-normal w-[10%] text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => handleRowClick(item)}
                            >
                                <td className="px-4 py-4 align-top font-bold text-gray-900 break-words">
                                    {item.term_kr}
                                </td>
                                <td className="px-4 py-4 align-top text-gray-600 break-words">
                                    {item.term_en}
                                </td>
                                <td className="px-4 py-4 align-top text-gray-600 text-xs leading-relaxed">
                                    <p className="line-clamp-2" title={item.description}>{item.description}</p>
                                </td>
                                <td className="px-4 py-4 align-top">
                                    <div className="text-gray-500 text-xs flex flex-wrap gap-1">
                                        {item.synonyms?.map((syn, idx) => (
                                            <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 border border-gray-200">
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-400 rounded-full"
                                                style={{ width: `${(item.chunk_count / maxChunkCount) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 w-4 text-right">{item.chunk_count}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 align-middle text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEditClick(e, item)}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                                            title="수정"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
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

            {/* Viewer Panel */}
            <ChunkViewer isOpen={isViewerOpen} onClose={closeViewer} data={selectedChunk} />

            {/* Edit Modal Mockup */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">용어 수정 (Mockup)</h3>
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
            )}
        </div>
    );
};

export default SynonymList;
