'use client';

import { useState, useEffect } from 'react';
import HomepageContent from './HomepageContent';

interface HomeContentProps {
  initialSortOption: string;
}

export default function HomeContent({ initialSortOption }: HomeContentProps) {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const envToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    // 调试日志
    console.log('Environment variables:', {
      NEXT_PUBLIC_ACCESS_TOKEN: envToken,
      savedToken
    });

    if (savedToken && savedToken === envToken) {
      console.log('Token matched, authenticating...');
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const envToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    // 调试日志
    console.log('Token validation:', {
      inputToken: token,
      envToken: envToken,
      matches: token === envToken
    });

    if (!envToken) {
      setError('环境变量未正确配置');
      return;
    }

    if (token === envToken) {
      console.log('Authentication successful');
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('auth_token', token);
    } else {
      console.log('Authentication failed');
      setError('访问令牌无效');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setToken('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">访问验证</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-lg text-xs">
              <p>开发环境信息：</p>
              <p>环境变量：{process.env.NEXT_PUBLIC_ACCESS_TOKEN || '未设置'}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                访问令牌
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入访问令牌"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                       text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg 
                       transform hover:-translate-y-0.5 transition-all duration-200"
            >
              验证
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              退出登录
            </button>
          </div>
          <HomepageContent initialSortOption={initialSortOption} />
        </div>
      </main>
    </div>
  );
}