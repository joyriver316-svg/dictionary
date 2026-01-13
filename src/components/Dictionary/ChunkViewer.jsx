import React from 'react';
import { X, FileText, ChevronRight } from 'lucide-react';

const ChunkViewer = ({ selectedTerm, onClose }) => {
    // If selectedTerm is provided, it's considered open
    if (!selectedTerm) return null;

    const data = selectedTerm;

    return (
        <div className="absolute top-0 right-0 h-full w-[450px] bg-gray-50 shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-start bg-white sticky top-0 z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">Source Context</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{data?.term_kr}</h3>
                    <p className="text-sm text-gray-500">{data?.term_en}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Content Area - Card News Style */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {data?.chunks && data.chunks.length > 0 ? (
                    data.chunks.map((chunk, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <FileText size={14} className="opacity-80" />
                                    <span className="text-xs font-semibold tracking-wide">CHUNK #{index + 1}</span>
                                </div>
                                <span className="text-[10px] text-blue-100 bg-blue-700/30 px-2 py-0.5 rounded-full">ID: {chunk.id}</span>
                            </div>
                            <div className="p-5">
                                <p className="text-gray-700 leading-relaxed text-[15px] font-medium">
                                    {chunk.content}
                                </p>
                                <div className="mt-4 flex justify-end">
                                    <button className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline">
                                        원문 전체 보기 <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FileText size={24} />
                        </div>
                        <p className="text-gray-500 font-medium">연결된 청크가 없습니다</p>
                        <p className="text-xs text-gray-400 mt-1">이 용어와 연결된 원문 데이터가 존재하지 않습니다.</p>
                    </div>
                )}
            </div>

            {/* Footer statistics */}
            <div className="p-4 bg-white border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Total Chunks: {data?.chunk_count || 0}</span>
                <span>Created: 2026.01.12</span>
            </div>
        </div>
    );
};

export default ChunkViewer;
