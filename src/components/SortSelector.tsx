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
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-sm text-gray-500">
        排序方式:
      </label>
      <select
        id="sort"
        value={initialValue}
        onChange={handleSortChange}
        className="block border border-gray-300 bg-white rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
      >
        <option value="default">默认</option>
        <option value="alpha">字母顺序</option>
        <option value="recent">最近添加</option>
      </select>
    </div>
  );
}