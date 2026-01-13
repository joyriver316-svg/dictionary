
import React, { useState } from 'react';
import { X, FileText, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import SourceModal from './SourceModal';

const ChunkViewer = ({ selectedTerm, onClose, mode = 'overlay' }) => {
    const [selectedChunk, setSelectedChunk] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 20;

    // If selectedTerm is provided, it's considered open
    if (!selectedTerm) return null;

    const data = selectedTerm;
    const isOverlay = mode === 'overlay';

    // Filter chunks based on search term
    const rawChunks = data?.chunks || [];
    const allChunks = rawChunks.filter(chunk =>
        !searchTerm ||
        chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chunk.source && chunk.source.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(allChunks.length / itemsPerPage);
    const currentChunks = allChunks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page when search changes (handled in onChange)

    const handleViewSource = (chunk) => {
        setSelectedChunk(chunk);
    };

    const closeModal = () => {
        setSelectedChunk(null);
        setSearchTerm("");
    };

    return (
        <>
            <div className={
                isOverlay
                    ? "absolute top-0 right-0 h-full w-[450px] bg-gray-50 shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
                    : "w-full h-full bg-gray-50 flex flex-col"
            }>
                {/* Header */}
                <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 flex-shrink-0 min-h-[48px]">
                    <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-2">
                        <span className="shrink-0 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-[3px] text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                            SOURCE
                        </span>
                        <div className="flex items-baseline gap-2 shrink-0">
                            <h3 className="font-bold text-gray-900 text-sm truncate leading-none">{data?.term_kr}</h3>
                            <span className="text-xs text-gray-500 truncate leading-none">{data?.term_en}</span>
                        </div>
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-[120px] ml-auto">
                            <input
                                type="text"
                                placeholder="청크 검색"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full border border-gray-200 rounded px-2 py-1 pl-6 text-[10px] bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-colors placeholder:text-gray-300/[0]"
                            />
                            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            {/* Mobile/Compact placeholder handling or just icon if too small? */}
                        </div>
                    </div>
                    {isOverlay && (
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Content Area - Grouped by Source */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChunks.length > 0 ? (
                        Object.entries(currentChunks.reduce((acc, chunk) => {
                            const source = chunk.source || 'Unknown Source';
                            if (!acc[source]) acc[source] = [];
                            acc[source].push(chunk);
                            return acc;
                        }, {})).map(([source, chunks], groupIndex) => (
                            <div key={groupIndex} className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                                {/* Document Header */}
                                <div className="bg-gray-50/80 px-3 py-2 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText size={14} className="text-gray-400 shrink-0" />
                                        <h4 className="font-semibold text-xs text-gray-700 truncate leading-tight" title={source}>
                                            {source}
                                        </h4>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium shrink-0 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                        {chunks.length} chunks
                                    </span>
                                </div>

                                {/* Chunks List */}
                                <div className="p-2 space-y-2 bg-gray-50/30">
                                    {chunks.map((chunk, index) => (
                                        <div key={index} className="bg-white rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-3 group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                                    <span className="text-[10px] text-gray-400 font-mono">#{chunk.id}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleViewSource(chunk)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-500 font-semibold flex items-center gap-0.5 hover:underline"
                                                >
                                                    원문 보기 <ChevronRight size={10} />
                                                </button>
                                            </div>
                                            <p className="text-gray-700 text-xs leading-relaxed font-medium">
                                                {chunk.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                <FileText size={20} />
                            </div>
                            <p className="text-gray-500 font-medium text-sm">연결된 청크가 없습니다</p>
                            <p className="text-[10px] text-gray-400 mt-1">이 용어와 연결된 원문 데이터가 존재하지 않습니다.</p>
                        </div>
                    )}
                </div>

                {/* Footer statistics & Pagination */}
                <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2 flex-shrink-0">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Total: {allChunks.length}</span>
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="p-1 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="mx-2 font-semibold text-gray-700">{currentPage} / {totalPages}</span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className="p-1 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                        <span>Created: 2026.01.12</span>
                    </div>
                </div>
            </div>

            {/* Source Modal */}
            <SourceModal isOpen={!!selectedChunk} onClose={closeModal} chunk={selectedChunk} />
        </>
    );
};

export default ChunkViewer;
