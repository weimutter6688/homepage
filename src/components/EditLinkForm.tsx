'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateLink, getLinkById, isAuthenticated } from '@/utils/linksService';

interface EditLinkFormProps {
  id: string;
}

export default function EditLinkForm({ id }: EditLinkFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 检查认证状态
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    // 加载链接数据
    const fetchLink = async () => {
      try {
        const link = await getLinkById(id);
        if (link) {
          setTitle(link.title);
          setUrl(link.url);
          setDescription(link.description || '');
          setCategory(link.category);
        } else {
          setError('链接不存在');
        }
      } catch (error) {
        console.error('加载链接失败:', error);
        setError(error instanceof Error ? error.message : '加载链接失败');
      }
    };
    
    fetchLink();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await updateLink(id, { title, url, description, category });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('更新链接失败:', error);
      setError(error instanceof Error ? error.message : '更新链接失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          标题 *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-lg border-gray-200 border px-4 py-3 text-gray-900 focus:border-indigo-500 
                   focus:ring-indigo-500 shadow-sm transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-full rounded-lg border-gray-200 border px-4 py-3 text-gray-900 focus:border-indigo-500 
                   focus:ring-indigo-500 shadow-sm transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          描述
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-lg border-gray-200 border px-4 py-3 text-gray-900 focus:border-indigo-500 
                   focus:ring-indigo-500 shadow-sm transition-colors duration-200"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          分类 *
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-lg border-gray-200 border px-4 py-3 text-gray-900 focus:border-indigo-500 
                   focus:ring-indigo-500 shadow-sm transition-colors duration-200"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                   transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isSubmitting}
        >
          取消
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                   hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>更新中...</span>
            </div>
          ) : '更新'}
        </button>
      </div>
    </form>
  );
}