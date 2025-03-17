import { Suspense } from 'react';
import { use } from 'react';
import HomeContent from '@/components/HomeContent';

interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Home(props: PageProps) {
  const searchParams = use(props.searchParams);
  const sortOption = typeof searchParams.sort === 'string' ? searchParams.sort : 'default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Suspense>
        <HomeContent initialSortOption={sortOption} />
      </Suspense>
    </div>
  );
}
