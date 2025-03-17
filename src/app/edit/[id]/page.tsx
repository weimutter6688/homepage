import { Metadata } from 'next';
import Link from 'next/link';
import EditLinkForm from '@/components/EditLinkForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `编辑链接 - ${id}`,
    description: '编辑链接页面'
  };
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">编辑链接</h1>
          <EditLinkForm id={id} />
        </div>
      </main>
    </div>
  );
}