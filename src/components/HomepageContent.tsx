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
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">我的链接 ({links.length})</h2>
        <div className="flex gap-4">
          <SortSelector initialValue={initialSortOption} onChange={handleSortChange} />
          <AddLinkButton onAdd={() => router.refresh()} />
        </div>
      </div>

      {/* 按分类显示链接 */}
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">还没有添加任何链接</p>
          <p>点击右上角的&ldquo;添加链接&rdquo;按钮开始创建</p>
        </div>
      ) : (
        categories.map((category) => {
          const categoryLinks = sortedLinks.filter((link) => link.category === category);
          
          if (categoryLinks.length === 0) return null;
          
          const isExpanded = expandedCategories[category];
          
          return (
            <div key={category} className="mb-8">
              <div 
                className="flex items-center cursor-pointer mb-4" 
                onClick={() => toggleCategory(category)}
              >
                <h2 className="text-lg font-medium text-gray-900">{category}</h2>
                <span className="ml-2 text-gray-500 text-sm">
                  {isExpanded ? '▼' : '►'} ({categoryLinks.length})
                </span>
              </div>
              
              {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryLinks.map((link) => (
                    <LinkCard key={link.id} link={link} onDelete={() => router.refresh()} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </>
  );
}