import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Network, Pencil, PlusCircle } from 'lucide-react';

const KNTypeView = () => {
    const { activeCategoryId, knTypeData } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const data = knTypeData || [];

    // Determine max chunk count for relative bar width
    const maxChunkCount = Math.max(...data.map(item => item.chunk_count || 0), 10);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

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
                <p>이 카테고리에는 놀런타입 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">놀런타입 (KN Type)</h2>
                <div className="text-sm text-gray-500">
                    {data.length} 개 타입 정의
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left text-sm text-gray-700 table-fixed">
                    <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-normal w-[25%]">주어 (Subject)</th>
                            <th className="px-6 py-3 font-normal w-[25%]">관계 (Relation)</th>
                            <th className="px-6 py-3 font-normal w-[25%]">목적어 (Object)</th>
                            <th className="px-6 py-3 font-normal w-[15%]">청크 수</th>
                            <th className="px-6 py-3 font-normal w-[10%] text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 align-top font-bold text-gray-900 break-words">
                                    {item.subject}
                                </td>
                                <td className="px-6 py-4 align-top text-gray-600 break-words">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">
                                        {item.relation}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-top font-bold text-gray-900 break-words">
                                    {item.object}
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
