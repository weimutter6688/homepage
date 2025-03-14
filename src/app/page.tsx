import HomepageContent from '../components/HomepageContent';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 服务器组件 - 主页
export default async function Home(props: Props) {
  // 等待解析searchParams Promise
  const searchParams = await props.searchParams;
  
  // 获取排序选项
  const sortOption = typeof searchParams.sort === 'string' ? searchParams.sort : 'default';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">我的主页</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <HomepageContent initialSortOption={sortOption} />
        </div>
      </main>
    </div>
  );
}
