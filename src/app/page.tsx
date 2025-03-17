import { Suspense } from 'react';
import { use } from 'react';
import HomeContent from '../components/HomeContent';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
};

export default function Home(props: Props) {
  const params = use(Promise.resolve(props.searchParams));
  const sortOption = typeof params.sort === 'string' ? params.sort : 'default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Suspense>
        <HomeContent initialSortOption={sortOption} />
      </Suspense>
    </div>
  );
}
