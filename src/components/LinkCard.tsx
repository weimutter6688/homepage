'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteLink, Link } from '../utils/linksService';

interface LinkCardProps {
  link: Link;
  onDelete: () => void;
  isAuthenticated?: boolean;
}

export default function LinkCard({ link, onDelete, isAuthenticated }: LinkCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('确定要删除这个链接吗？')) {
      try {
        await deleteLink(link.id);
        onDelete();
      } catch (error) {
        console.error('删除链接失败:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full relative group">
      {isAuthenticated && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-200"
            aria-label="打开菜单"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 overflow-hidden ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={() => {
                    router.push(`/edit/${link.id}`);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  删除
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-grow group"
      >
        <h3 className="font-semibold text-lg text-indigo-600 mb-3 group-hover:text-indigo-500 transition-colors duration-200">
          {link.title}
        </h3>
        {link.description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{link.description}</p>
        )}
        <p className="text-gray-400 text-xs truncate hover:text-gray-500 transition-colors duration-200">
          {link.url}
        </p>
      </a>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600">
          {link.category}
        </span>
      </div>
    </div>
  );
}