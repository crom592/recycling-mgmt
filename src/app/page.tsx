'use client';

import { useState, useEffect } from 'react';
import { Item } from '@/types/item';
import { getItems, getStats, addItem, updateItem, deleteItem } from '@/lib/storage';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => {
    setItems(getItems());
    setStats(getStats());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addItem({ title, description });
    setTitle(''); setDescription(''); setShowAdd(false);
    refreshData();
  };

  const handleComplete = (id: string) => {
    updateItem(id, { status: 'completed' });
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      deleteItem(id);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400">♻️ 무인회수기 관리</h1>
          <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium">+ 추가</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">활성</p>
            <p className="text-4xl font-bold text-green-400">{stats.active}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">완료</p>
            <p className="text-4xl font-bold text-blue-400">{stats.completed}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">전체</p>
            <p className="text-4xl font-bold text-purple-400">{stats.total}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700"><h2 className="text-lg font-bold">목록</h2></div>
          <div className="divide-y divide-gray-700">
            {items.length === 0 ? (
              <p className="p-8 text-center text-gray-500">항목이 없습니다</p>
            ) : items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className={`text-lg font-bold ${item.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{item.title}</p>
                  {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
                </div>
                <div className="flex gap-2">
                  {item.status !== 'completed' && (
                    <button onClick={() => handleComplete(item.id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">완료</button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">새 항목 추가</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">제목 *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">설명</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">추가</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
