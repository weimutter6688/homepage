'use client';

import { useState } from 'react';
import { Link, deleteLink } from '@/utils/linksService';
import { useRouter } from 'next/navigation';

interface LinkCardProps {
  link: Link;
  onDelete?: () => void;
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('确定要删除这个链接吗？')) {
      const success = await deleteLink(link.id);
      if (success) {
        // 触发storage事件以通知其他组件数据变化
        window.dispatchEvent(new Event('storage'));
        
        // 如果提供了onDelete回调，则调用它来刷新父组件
        if (onDelete) {
          onDelete();
        } else {
          router.refresh();
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full relative">
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="打开菜单"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button 
                onClick={() => {
                  router.push(`/edit/${link.id}`);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                编辑
              </button>
              <button 
                onClick={() => {
                  handleDelete();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                删除
              </button>
            </div>
          </div>
        )}
      </div>
      
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-grow"
      >
        <h3 className="font-medium text-lg text-blue-600 mb-2">{link.title}</h3>
        {link.description && (
          <p className="text-gray-600 text-sm mb-2">{link.description}</p>
        )}
        <p className="text-gray-400 text-xs truncate">{link.url}</p>
      </a>
      
      <div className="mt-4 pt-2 border-t border-gray-100">
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
          {link.category}
        </span>
      </div>
    </div>
  );
}