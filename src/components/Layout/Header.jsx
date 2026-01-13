import React from 'react';
import { Bell, User, Settings as SettingsIcon } from 'lucide-react'; // Renamed import to avoid confusion
import useStore from '../../store/useStore';

const Header = () => {
    const { currentUser, logout, workspaces, activeWorkspaceId, setActiveTab } = useStore();

    const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

    return (
        <header className="h-14 bg-[#1e293b] text-white flex items-center justify-between px-4 shadow-md z-30 relative">
            {/* Logo Area */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-lg">
                    K
                </div>
                <div className="flex flex-col -space-y-0.5">
                    <span className="font-semibold text-base tracking-tight leading-tight">KNOWLEARN Ontology</span>
                    <span className="text-[10px] text-blue-200 font-light tracking-wider">Ontology-RAG Explorer</span>
                </div>
            </div>

            {/* Center Area: Active Workspace Name */}
            <div className="flex-1 flex justify-center">
                {activeWorkspace && (
                    <div className="bg-[#334155] px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 border border-[#475569] flex items-center shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        {activeWorkspace.name}
                    </div>
                )}
            </div>

            {/* Right Area: Tools, Notifications & Profile */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setActiveTab('settings')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-full transition-colors"
                    title="설정"
                >
                    <SettingsIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="relative group ml-1">
                    <button className="flex items-center space-x-2 focus:outline-none">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-medium border-2 border-[#1e293b] ring-2 ring-gray-700 group-hover:ring-gray-500 transition-all">
                            {currentUser?.name ? currentUser.name[0] : <User className="h-4 w-4" />}
                        </div>
                    </button>
                    {/* Logout Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-opacity duration-200 z-50">
                        <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                            {currentUser?.name}님 환영합니다
                        </div>
                        <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
