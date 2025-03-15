'use client';

import { useCallback } from 'react';

interface SortSelectorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export default function SortSelector({ initialValue, onChange }: SortSelectorProps) {
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-600">
        <svg className="w-5 h-5 inline-block mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        排序
      </span>
      <select
        id="sort"
        value={initialValue}
        onChange={handleSortChange}
        className="block w-32 pl-3 pr-10 py-2 text-sm font-medium text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-200
                 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent"
      >
        <option value="default">默认排序</option>
        <option value="alpha">字母顺序</option>
        <option value="recent">最近添加</option>
      </select>
    </div>
  );
}