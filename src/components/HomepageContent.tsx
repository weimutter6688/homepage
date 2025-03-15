'use client';

import { useEffect, useState } from 'react';
import { getAllLinks, getAllCategories, Link } from '@/utils/linksService';
import LinkCard from '@/components/LinkCard';
import SortSelector from '@/components/SortSelector';
import AddLinkButton from '@/components/AddLinkButton';
import { useRouter } from 'next/navigation';

interface HomepageContentProps {
  initialSortOption: string;
}

export default function HomepageContent({ initialSortOption }: HomepageContentProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 添加分类折叠状态
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  // 获取链接和分类数据
  useEffect(() => {
    const fetchData = () => {
      try {
        const linksData = getAllLinks();
        const categoriesData = getAllCategories();
        setLinks(linksData);
        setCategories(categoriesData);
        
        // 初始化所有分类为展开状态
        const initialExpandState: Record<string, boolean> = {};
        categoriesData.forEach(category => {
          initialExpandState[category] = true; // 默认展开
        });
        setExpandedCategories(initialExpandState);
      } catch (error) {
        console.error('获取数据错误:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // 添加事件监听器，在localStorage变化时刷新数据
    const handleStorageChange = () => {
      fetchData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理分类的展开/折叠
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 处理排序
  const sortLinks = (links: Link[], sortOption: string) => {
    const sortedLinks = [...links];
    if (sortOption === 'alpha') {
      sortedLinks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'recent') {
      // 根据ID排序，假设ID是按添加顺序递增的
      sortedLinks.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return sortedLinks;
  };

  const sortedLinks = sortLinks(links, initialSortOption);
  
  // 处理排序变化
  const handleSortChange = (newSortOption: string) => {
    router.push(`/?sort=${newSortOption}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-sm p-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">homepage</h3>
        </div>
        <div className="flex gap-4 items-center">
          <SortSelector initialValue={initialSortOption} onChange={handleSortChange} />
          <AddLinkButton onAdd={() => router.refresh()} />
        </div>
      </div>

      {/* 按分类显示链接 */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">还没有添加任何链接</p>
          <p className="mt-2 text-sm text-gray-500">点击右上角的"添加链接"按钮开始创建</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category, index) => {
            const categoryLinks = sortedLinks.filter((link) => link.category === category);
            
            if (categoryLinks.length === 0) return null;
            
            const isExpanded = expandedCategories[category];
            
            // 交替的渐变色背景
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
                      <LinkCard key={link.id} link={link} onDelete={() => router.refresh()} />
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