import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Network, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import GraphVisualizer from '../Relationship/GraphVisualizer';
import classNames from 'classnames';

const KNTypeView = () => {
    const { activeCategoryId, knTypeData } = useStore();
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailOpen, setIsDetailOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30; // Compact view, maybe 30 is good

    const data = knTypeData || [];

    // Filter displayed data based on search term
    const filteredData = data.filter(item =>
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.object.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset page on search
    };

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
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
                    <h2 className="text-lg font-semibold text-gray-800">놀런타입 (Knowlearn Type)</h2>
                </div>
                <div className="flex-1 h-[calc(100%-3.5rem)] flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Network size={48} className="opacity-20" />
                    <p>이 카테고리에는 놀런타입 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Pane: List */}
                <div className="flex-1 border-r border-gray-200 flex flex-col bg-white transition-all duration-300 ease-in-out">
                    <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">놀런타입 (Knowlearn Type)</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                                {data.length} 개 타입 정의
                            </div>
                            {!isDetailOpen && selectedItem && (
                                <button
                                    onClick={() => setIsDetailOpen(true)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                                    title="상세정보 펼치기"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-white">
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-2">
                            <div className="relative max-w-sm">
                                <input
                                    type="text"
                                    placeholder="트리플 검색 (주어, 관계, 목적어)..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 pl-9 text-sm focus:border-primary focus:outline-none"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                            </div>
                        </div>
                        <table className="w-full text-left text-sm text-gray-700 table-fixed">
                            <thead className="bg-gray-50 text-xs text-gray-500 font-medium sticky top-[53px] z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-2 font-normal w-[33%]">주어 (Subject)</th>
                                    <th className="px-3 py-2 font-normal w-[33%]">관계 (Relation)</th>
                                    <th className="px-3 py-2 font-normal w-[34%]">목적어 (Object)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={classNames(
                                            "hover:bg-blue-50 transition-colors cursor-pointer group",
                                            selectedItem?.subject === item.subject && selectedItem?.object === item.object ? "bg-blue-50" : ""
                                        )}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td className="px-3 py-1.5 align-top font-bold text-gray-900 break-words truncate">
                                            <span title={item.subject}>{item.subject}</span>
                                        </td>
                                        <td className="px-3 py-1.5 align-top text-gray-600 break-words">
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs border border-gray-200 inline-block max-w-full truncate" title={item.relation}>
                                                {item.relation}
                                            </span>
                                        </td>
                                        <td className="px-3 py-1.5 align-top font-bold text-gray-900 break-words truncate">
                                            <span title={item.object}>{item.object}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Footer */}
                    {filteredData.length > 0 && (
                        <div className="flex justify-center items-center gap-2 p-2 border-t border-gray-200 bg-white flex-shrink-0">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs text-gray-500 font-medium">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Pane: Graph Only */}
                <div className={classNames(
                    "flex flex-col bg-gray-50 border-l border-gray-200 transition-all duration-300 ease-in-out overflow-hidden relative shrink-0",
                    isDetailOpen ? "w-1/3 opacity-100" : "w-0 opacity-0 border-none"
                )}>
                    {selectedItem ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 bg-white h-14 flex-shrink-0 px-4">
                                <div className="flex h-full items-center gap-2 text-sm font-medium text-blue-600">
                                    <Network size={16} />
                                    그래프
                                </div>
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                    title="상세정보 접기"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Graph Visualizer */}
                            <div className="flex-1 overflow-hidden relative p-4">
                                <GraphVisualizer
                                    relationships={data}
                                    centerNode={selectedItem.subject}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p className="text-lg font-medium text-gray-500">항목을 선택하세요</p>
                            <p className="text-sm text-gray-400 mt-2">좌측에서 놀런타입을 선택하세요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KNTypeView;
