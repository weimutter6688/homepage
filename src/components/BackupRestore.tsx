'use client';

import { useState } from 'react';
import { getAllLinks, Link } from '../utils/linksService';

interface BackupRestoreProps {
  onRestore: () => void;
}

export default function BackupRestore({ onRestore }: BackupRestoreProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExport = () => {
    try {
      const links = getAllLinks();
      const dataStr = JSON.stringify(links, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `homepage-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess('备份文件已下载');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('导出失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const importedData = JSON.parse(text) as Link[];

      // 验证导入的数据结构
      if (!Array.isArray(importedData) || !importedData.every(isValidLink)) {
        throw new Error('无效的备份文件格式');
      }

      localStorage.setItem('homepage_links', JSON.stringify(importedData));
      onRestore();
      setSuccess('数据已成功导入');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('导入失败：请确保文件格式正确');
      setTimeout(() => setError(''), 3000);
    }

    // 重置文件输入以允许重复导入相同文件
    event.target.value = '';
  };

  const isValidLink = (link: any): link is Link => {
    return (
      typeof link === 'object' &&
      typeof link.id === 'string' &&
      typeof link.title === 'string' &&
      typeof link.url === 'string' &&
      typeof link.category === 'string' &&
      (link.description === undefined || typeof link.description === 'string')
    );
  };

  return (
    <div className="flex items-center gap-4">
      {/* 导出按钮 */}
      <button
        onClick={handleExport}
        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md 
                 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        title="导出所有链接到JSON文件"
      >
        导出备份
      </button>

      {/* 导入按钮 */}
      <label className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      cursor-pointer">
        导入备份
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>

      {/* 状态消息 */}
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
      {success && (
        <span className="text-sm text-green-600">{success}</span>
      )}
    </div>
  );
}