import React, { useEffect, useState } from 'react';
import { X, FileText, Calendar, User, Tag } from 'lucide-react';

const SourceModal = ({ isOpen, onClose, chunk }) => {
    if (!isOpen || !chunk) return null;

    // Mock full content expansion
    // In a real app, this would fetch the full document content based on chunk.id or source_id
    // For now, we will simulate "Full Context" by repeating the chunk or showing a placeholder
    const fullContent = `
[Source Document: ${chunk.id}]

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

--- Highlighted Chunk ---
${chunk.content}
-------------------------

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
    `.trim();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">원문 전체 보기</h3>
                            <p className="text-xs text-gray-500">Source ID: {chunk.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-full">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">피부 임상 연구 보고서 ({chunk.id})</h1>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-8 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>2025. 12. 15</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>Dr. Kim</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Tag size={14} />
                                <span>Clinical Report</span>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                            {fullContent}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SourceModal;
