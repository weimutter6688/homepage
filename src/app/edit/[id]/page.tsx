'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EditLinkForm from '@/components/EditLinkForm';
import { isAuthenticated } from '@/utils/linksService';

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    // 检查认证状态
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">编辑链接</h1>
          <EditLinkForm id={params.id} />
        </div>
      </main>
    </div>
  );
}