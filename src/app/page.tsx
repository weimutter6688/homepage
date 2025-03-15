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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <main className="py-8">
        <HomepageContent initialSortOption={sortOption} />
      </main>
    </div>
  );
}
