'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddLinkButton from './AddLinkButton';
import LinkCard from './LinkCard';
import SortSelector from './SortSelector';
import BackupRestore from './BackupRestore';
import { getAllLinks, Link, isAuthenticated } from '../utils/linksService';

interface HomepageContentProps {
  initialSortOption: string;
}

export default function HomepageContent({ initialSortOption }: HomepageContentProps) {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sortOption, setSortOption] = useState(initialSortOption);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    
    const loadLinks = async () => {
      const fetchedLinks = await getAllLinks();
      setLinks(fetchedLinks);
    };
    
    loadLinks();

    const handleStorageChange = async () => {
      const fetchedLinks = await getAllLinks();
      setLinks(fetchedLinks);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

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

  const handleRestore = async () => {
    const fetchedLinks = await getAllLinks();
    setLinks(fetchedLinks);
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
  
  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-sm p-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">homepage</h3>
        </div>
        <div className="flex gap-4 items-center">
          <BackupRestore onRestore={handleRestore} />
          <SortSelector initialValue={initialSortOption} onChange={handleSortChange} />
          <AddLinkButton onAdd={() => router.refresh()} />
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
        <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
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
              <div
                key={category}
                className={`bg-gradient-to-r ${gradientColor} rounded-2xl shadow-sm p-6 transition-all duration-200`}
              >
                <div className="max-h-[600px] flex flex-col">
                  <div className="flex-shrink-0">
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
                  </div>
                  {isExpanded && (
                    <div className="mt-4 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {categoryLinks.slice(0, 5).map((link) => (
                          <LinkCard 
                            key={link.id} 
                            link={link} 
                            onDelete={() => router.refresh()} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}