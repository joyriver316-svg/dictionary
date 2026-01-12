import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import classNames from 'classnames';
import { Plus, X, Check } from 'lucide-react';

const LNB = () => {
    const { categories, activeCategoryId, setActiveCategory, initialize, addCategory } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName);
            setNewCategoryName("");
            setIsAdding(false);
        }
    };

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <nav className="w-[280px] bg-lnb-bg h-screen border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Knowlearn Ontology</h1>
                <p className="text-xs text-gray-500 mt-1">Ontology-RAG Explorer</p>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span>카테고리</span>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title="카테고리 추가"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <ul className="space-y-1 px-2">
                    {isAdding && (
                        <li className="px-4 py-2">
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="새 카테고리 명"
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddCategory();
                                        if (e.key === 'Escape') setIsAdding(false);
                                    }}
                                />
                                <button onClick={handleAddCategory} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                    <Check size={14} />
                                </button>
                                <button onClick={() => setIsAdding(false)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                    <X size={14} />
                                </button>
                            </div>
                        </li>
                    )}
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => setActiveCategory(category.id)}
                                className={classNames(
                                    "w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150",
                                    activeCategoryId === category.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        U
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">사용자</p>
                        <p className="text-xs text-gray-500">TFT 멤버</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LNB;
