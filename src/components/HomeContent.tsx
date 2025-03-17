'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddLinkButton from './AddLinkButton';
import LinkCard from './LinkCard';
import SortSelector from './SortSelector';
import BackupRestore from './BackupRestore';
import { getAllLinks, Link } from '../utils/linksService';

interface HomeContentProps {
  initialSortOption: string;
}

export default function HomeContent({ initialSortOption }: HomeContentProps) {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const authToken = getCookie('auth_token');
    if (authToken === process.env.NEXT_PUBLIC_ACCESS_TOKEN) {
      setIsAuthenticated(true);
      setLinks(getAllLinks());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token === process.env.NEXT_PUBLIC_ACCESS_TOKEN) {
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      setIsAuthenticated(true);
      setError('');
      router.refresh(); // 刷新页面以更新服务器组件
    } else {
      setError('访问令牌无效');
    }
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsAuthenticated(false);
    setLinks([]);
    setToken('');
    router.refresh(); // 刷新页面以更新服务器组件
  };

  const categories = Array.from(new Set(links.map(link => link.category))).sort();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    const url = new URL(window.location.href);
    url.searchParams.set('sort', newSortOption);
    window.history.pushState({}, '', url.toString());
  };

  const handleRestore = () => {
    setLinks(getAllLinks());
    router.refresh(); // 刷新页面以确保数据同步
  };

  const sortedLinks = [...links].sort((a, b) => {
    switch (sortOption) {
      case 'alpha':
        return a.title.localeCompare(b.title);
      case 'recent':
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                访问令牌
              </label>
              <input
                type="password"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-sm p-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">homepage</h3>
        </div>
        <div className="flex items-center gap-4">
          <BackupRestore onRestore={handleRestore} />
          <SortSelector initialValue={initialSortOption} onChange={handleSortChange} />
          <AddLinkButton onAdd={() => {
            setLinks(getAllLinks());
            router.refresh();
          }} />
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            退出登录
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">还没有添加任何链接</p>
          <p className="mt-2 text-sm text-gray-500">点击右上角的&quot;添加链接&quot;按钮开始创建</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category, index) => {
            const categoryLinks = sortedLinks.filter((link) => link.category === category);
            
            if (categoryLinks.length === 0) return null;
            
            const isExpanded = expandedCategories[category];
            
            const gradients = [
              'from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100',
              'from-rose-50 to-orange-50 hover:from-rose-100 hover:to-orange-100',
              'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100',
              'from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100'
            ];
            
            const gradientColor = gradients[index % gradients.length];
            const textColor = index % 2 === 0 ? 'text-indigo-600' : 'text-rose-600';
            const hoverTextColor = index % 2 === 0 ? 'group-hover:text-indigo-700' : 'group-hover:text-rose-700';
            const counterBg = index % 2 === 0 ? 'bg-indigo-100' : 'bg-rose-100';
            
            return (
              <div key={category} className={`bg-gradient-to-r ${gradientColor} rounded-2xl shadow-sm p-6 transition-all duration-200`}>
                <div
                  className="flex items-center cursor-pointer group"
                  onClick={() => toggleCategory(category)}
                >
                  <h2 className={`text-xl font-bold ${textColor} ${hoverTextColor} transition-colors duration-200`}>
                    {category}
                  </h2>
                  <div className="ml-3 flex items-center">
                    <span className={`${counterBg} ${textColor} px-2.5 py-0.5 rounded-full text-sm font-medium`}>
                      {categoryLinks.length}
                    </span>
                    <svg
                      className={`ml-2 h-5 w-5 ${textColor} transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryLinks.map((link) => (
                      <LinkCard 
                        key={link.id} 
                        link={link} 
                        onDelete={() => {
                          setLinks(getAllLinks());
                          router.refresh();
                        }} 
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}