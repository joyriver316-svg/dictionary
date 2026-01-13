import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Lock, User } from 'lucide-react';

const LoginView = () => {
    const { login } = useStore();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!id || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        const success = login(id, password);
        if (!success) {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                        K
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">KNOWLEARN Orchestra</h1>
                    <p className="text-gray-500 mt-2 text-sm">서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="id">아이디</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                                placeholder="아이디를 입력하세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">비밀번호</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        type="submit"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;
