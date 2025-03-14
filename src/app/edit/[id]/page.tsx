import ClientEditLinkForm from '@/components/ClientEditLinkForm';

interface Props {
  params: Promise<{ id: string }>;
}

// 编辑链接页面组件 - 服务器组件
export default async function EditLinkPage(props: Props) {
  // 等待解析params Promise
  const params = await props.params;
  const { id } = params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">编辑链接</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
            <ClientEditLinkForm linkId={id} />
          </div>
        </div>
      </main>
    </div>
  );
}