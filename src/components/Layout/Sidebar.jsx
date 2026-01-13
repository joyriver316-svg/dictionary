import React, { useState, useEffect } from 'react';
import { Book, Network, Sparkles, Plus, Search, Check, X, ChevronRight, ChevronDown, AlignLeft, Pencil } from 'lucide-react';
import classNames from 'classnames';
import useStore from '../../store/useStore';

const Sidebar = () => {
    const {
        activeTab,
        setActiveTab,
        categories,
        activeCategoryId,
        setActiveCategory,
        initialize,
        updateCategory
    } = useStore();

    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Initialize categories on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    const menuItems = [
        { id: 'dictionary', label: '개념사전', icon: Book },
        { id: 'relationship', label: '관계사전', icon: Network },
        { id: 'kn_type', label: '놀런타입', icon: Sparkles },
    ];

    const needsCategory = ['dictionary', 'relationship', 'kn_type'].includes(activeTab);

    // Filter Categories
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStartEdit = (category) => {
        setEditingCategoryId(category.id);
        setEditingName(category.name);
    };

    const handleSaveEdit = () => {
        if (editingName.trim()) {
            updateCategory(editingCategoryId, editingName);
            setEditingCategoryId(null);
            setEditingName("");
        }
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingName("");
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 z-20">
            {/* Top: Main Menu (Collapsible) */}
            <div className="border-b border-gray-100 flex flex-col transition-all duration-300 ease-in-out">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                >
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center group-hover:text-gray-700">
                        <AlignLeft size={14} className="mr-2" />
                        메인 메뉴
                    </h2>
                    <ChevronDown size={14} className={classNames("text-gray-400 transition-transform duration-200", isMenuOpen ? "" : "-rotate-90")} />
                </button>

                <div className={classNames(
                    "overflow-hidden transition-all duration-300 ease-in-out px-2",
                    isMenuOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={classNames(
                                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                                    activeTab === item.id
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Middle: Category List (Conditional) */}
            {needsCategory && (
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">카테고리</h2>
                        {/* No Add Button */}
                    </div>

                    {/* Search */}
                    <div className="px-4 mb-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                            />
                            <Search className="absolute left-2.5 top-2 text-gray-400" size={12} />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200">
                        {filteredCategories.map((category) => (
                            <div key={category.id}>
                                {editingCategoryId === category.id ? (
                                    <div className="px-2 py-1 bg-blue-50 rounded-md ring-1 ring-blue-500 flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="flex-1 min-w-0 text-xs border-transparent bg-transparent focus:outline-none"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit();
                                                if (e.key === 'Escape') handleCancelEdit();
                                            }}
                                        />
                                        <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded flex-shrink-0">
                                            <Check size={12} />
                                        </button>
                                        <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:bg-red-100 rounded flex-shrink-0">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveCategory(category.id)}
                                        className={classNames(
                                            "w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 flex items-center justify-between group",
                                            activeCategoryId === category.id
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <span className="truncate flex-1">{category.name}</span>
                                        <div className="flex items-center gap-1 ml-2">
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleStartEdit(category); }}
                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="수정"
                                            >
                                                <Pencil size={12} />
                                            </div>
                                            {activeCategoryId === category.id && <ChevronRight size={14} className="text-blue-500" />}
                                        </div>
                                    </button>
                                )}
                            </div>
                        ))}
                        {filteredCategories.length === 0 && (
                            <div className="text-center py-4 text-xs text-gray-400">
                                {searchTerm ? '검색 결과가 없습니다.' : '카테고리가 없습니다.'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
