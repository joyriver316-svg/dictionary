import React, { useState } from 'react';
import useStore from '../../store/useStore';
import classNames from 'classnames';

const SettingsView = () => {
    const {
        dbSettings,
        updateDbSettings,
        users,
        addUser,
        updateUser,
        deleteUser,
        currentUser,
        workspaces,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        activeWorkspaceId,
        setActiveWorkspace
    } = useStore();

    const [activeTab, setActiveTab] = useState('db'); // 'db' | 'users' | 'workspace'
    const [localDbSettings, setLocalDbSettings] = useState(dbSettings);
    const [editingUser, setEditingUser] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [userForm, setUserForm] = useState({ id: '', name: '', password: '' });

    // Workspace State
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
    const [workspaceForm, setWorkspaceForm] = useState({ name: '', description: '' });

    // DB Settings Handlers
    const handleDbChange = (e) => {
        const { name, value } = e.target;
        setLocalDbSettings(prev => ({ ...prev, [name]: value }));
    };

    const saveDbSettings = () => {
        updateDbSettings(localDbSettings);
        alert('DB 설정이 저장되었습니다.');
    };

    // User Management Handlers
    const handleUserEdit = (user) => {
        setEditingUser(user.id);
        setUserForm(user);
        setIsAddingUser(false);
    };

    const handleUserDelete = (id) => {
        if (id === currentUser.id) {
            alert('현재 로그인된 사용자는 삭제할 수 없습니다.');
            return;
        }
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            deleteUser(id);
        }
    };

    const startAddUser = () => {
        setEditingUser(null);
        setIsAddingUser(true);
        setUserForm({ id: '', name: '', password: '' });
    };

    const cancelUserForm = () => {
        setEditingUser(null);
        setIsAddingUser(false);
        setUserForm({ id: '', name: '', password: '' });
    };

    const saveUser = (e) => {
        e.preventDefault();
        if (!userForm.id || !userForm.name || !userForm.password) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (isAddingUser) {
            if (users.find(u => u.id === userForm.id)) {
                alert('이미 존재하는 ID입니다.');
                return;
            }
            addUser(userForm);
        } else {
            updateUser(userForm);
        }
        cancelUserForm();
    };

    // Workspace Handlers
    const handleWorkspaceEdit = (ws) => {
        setEditingWorkspace(ws.id);
        setWorkspaceForm(ws);
        setIsAddingWorkspace(false);
    };

    const handleWorkspaceDelete = (id) => {
        if (workspaces.length <= 1) {
            alert('최소 하나의 워크스페이스가 필요합니다.');
            return;
        }
        if (activeWorkspaceId === id) {
            alert('활성 워크스페이스는 삭제할 수 없습니다. 다른 워크스페이스를 먼저 활성화해주세요.');
            return;
        }
        if (window.confirm('정말로 이 워크스페이스를 삭제하시겠습니까?')) {
            deleteWorkspace(id);
        }
    };

    const startAddWorkspace = () => {
        setEditingWorkspace(null);
        setIsAddingWorkspace(true);
        setWorkspaceForm({ name: '', description: '' });
    };

    const cancelWorkspaceForm = () => {
        setEditingWorkspace(null);
        setIsAddingWorkspace(false);
        setWorkspaceForm({ name: '', description: '' });
    };

    const saveWorkspace = (e) => {
        e.preventDefault();
        if (!workspaceForm.name) {
            alert('워크스페이스 이름을 입력해주세요.');
            return;
        }

        if (isAddingWorkspace) {
            addWorkspace(workspaceForm);
        } else {
            updateWorkspace(workspaceForm);
        }
        cancelWorkspaceForm();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <h1 className="text-xl font-bold text-gray-800">설정</h1>
                <p className="text-sm text-gray-500 mt-1">애플리케이션 설정을 관리합니다.</p>
            </div>

            {/* Sub Tabs */}
            <div className="px-6 pt-2 bg-white border-b border-gray-200">
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('db')}
                        className={classNames(
                            "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
                            activeTab === 'db'
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        DB 연결 설정
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={classNames(
                            "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
                            activeTab === 'users'
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        사용자 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('workspace')}
                        className={classNames(
                            "pb-3 text-sm font-medium border-b-2 transition-colors duration-200",
                            activeTab === 'workspace'
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        워크스페이스
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                {/* DB Connection Settings */}
                {activeTab === 'db' && (
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn max-w-2xl">
                        {/* ... Existing DB content ... */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                            <span className="mr-2">🔌</span> 데이터베이스 연결
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                                    <input
                                        type="text"
                                        name="host"
                                        value={localDbSettings.host}
                                        onChange={handleDbChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                                    <input
                                        type="text"
                                        name="port"
                                        value={localDbSettings.port}
                                        onChange={handleDbChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                    <input
                                        type="text"
                                        name="user"
                                        value={localDbSettings.user}
                                        onChange={handleDbChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={localDbSettings.password}
                                        onChange={handleDbChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                                <input
                                    type="text"
                                    name="dbName"
                                    value={localDbSettings.dbName}
                                    onChange={handleDbChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end border-t pt-4">
                            <button
                                onClick={saveDbSettings}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                            >
                                설정 저장
                            </button>
                        </div>
                    </section>
                )}

                {/* User Management Settings */}
                {activeTab === 'users' && (
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn max-w-4xl">
                        {/* ... Existing User content ... */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <span className="mr-2">👥</span> 사용자 목록
                            </h2>
                            {!isAddingUser && !editingUser && (
                                <button
                                    onClick={startAddUser}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm transition-colors duration-200"
                                >
                                    + 사용자 추가
                                </button>
                            )}
                        </div>

                        {(isAddingUser || editingUser) && (
                            <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                                <h3 className="text-md font-semibold text-gray-800 mb-4">{isAddingUser ? '새 사용자 추가' : '사용자 수정'}</h3>
                                <form onSubmit={saveUser} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">이름</label>
                                        <input
                                            type="text"
                                            value={userForm.name}
                                            onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="이름 입력"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID</label>
                                        <input
                                            type="text"
                                            value={userForm.id}
                                            onChange={e => setUserForm({ ...userForm, id: e.target.value })}
                                            disabled={!isAddingUser}
                                            className={classNames(
                                                "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
                                                !isAddingUser
                                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            )}
                                            placeholder="ID 입력"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">비밀번호</label>
                                        <input
                                            type="text"
                                            value={userForm.password}
                                            onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="비밀번호 입력"
                                        />
                                    </div>
                                    <div className="col-span-1 sm:col-span-3 flex justify-end space-x-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={cancelUserForm}
                                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">이름</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">ID</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">비밀번호</th>
                                        <th className="px-6 py-3 text-right font-semibold text-gray-500 uppercase tracking-wider text-xs">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-900 font-medium">{user.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{user.id}</td>
                                            <td className="px-6 py-4 text-gray-400 font-mono tracking-widest">••••••</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleUserEdit(user)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium mr-4"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleUserDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Workspace Settings */}
                {activeTab === 'workspace' && (
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <span className="mr-2">🏢</span> 워크스페이스 관리
                            </h2>
                            {!isAddingWorkspace && !editingWorkspace && (
                                <button
                                    onClick={startAddWorkspace}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm transition-colors duration-200"
                                >
                                    + 워크스페이스 추가
                                </button>
                            )}
                        </div>

                        {(isAddingWorkspace || editingWorkspace) && (
                            <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                                <h3 className="text-md font-semibold text-gray-800 mb-4">{isAddingWorkspace ? '새 워크스페이스 추가' : '워크스페이스 수정'}</h3>
                                <form onSubmit={saveWorkspace} className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">이름</label>
                                        <input
                                            type="text"
                                            value={workspaceForm.name}
                                            onChange={e => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="워크스페이스 이름"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">설명</label>
                                        <input
                                            type="text"
                                            value={workspaceForm.description}
                                            onChange={e => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="간단한 설명"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={cancelWorkspaceForm}
                                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">상태</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">이름</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">설명</th>
                                        <th className="px-6 py-3 text-right font-semibold text-gray-500 uppercase tracking-wider text-xs">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {workspaces.map((ws) => (
                                        <tr key={ws.id} className={classNames("hover:bg-gray-50 transition-colors", activeWorkspaceId === ws.id ? "bg-blue-50/50" : "")}>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setActiveWorkspace(ws.id)}
                                                    className={classNames(
                                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                                        activeWorkspaceId === ws.id
                                                            ? "border-blue-600 bg-blue-600"
                                                            : "border-gray-300 hover:border-blue-400"
                                                    )}
                                                >
                                                    {activeWorkspaceId === ws.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">
                                                {ws.name}
                                                {activeWorkspaceId === ws.id && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Active</span>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{ws.description}</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleWorkspaceEdit(ws)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium mr-4"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleWorkspaceDelete(ws.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
