'use client';

import { useState, useEffect } from 'react';
import { Link, getAllLinks } from '@/utils/linksService';
import { useRouter } from 'next/navigation';
import EditLinkForm from './EditLinkForm';

interface ClientEditLinkFormProps {
  linkId: string;
}

export default function ClientEditLinkForm({ linkId }: ClientEditLinkFormProps) {
  const [link, setLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // 从localStorage获取所有链接
    const links = getAllLinks();
    // 查找与ID匹配的链接
    const foundLink = links.find(l => l.id === linkId);
    
    // 如果没有找到链接，重定向到主页
    if (!foundLink) {
      router.push('/');
      return;
    }
    
    // 设置找到的链接到状态
    setLink(foundLink);
    setIsLoading(false);
  }, [linkId, router]);
  
  // 加载状态
  if (isLoading) {
    return <div className="flex justify-center items-center">加载中...</div>;
  }
  
  // 如果没有找到链接
  if (!link) {
    return null;
  }
  
  // 渲染编辑表单
  return <EditLinkForm link={link} />;
}