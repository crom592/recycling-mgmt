'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Home as HomeIcon, Plus, X, Trash2, Leaf, Award, Scale, History, Check, Star, ChevronDown, TreePine, Globe, Coins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { RecycleRecord } from '@/types/recycling';
import { getRecords, addRecord, deleteRecord, getStats, recycleTypes, getTypeBreakdown, getMonthlyData } from '@/lib/recycleStorage';

const COLORS = ['#3B82F6', '#EAB308', '#22C55E', '#6B7280', '#A855F7', '#EC4899'];

export default function Home() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [tab, setTab] = useState<'record' | 'history' | 'stats'>('record');
  const [records, setRecords] = useState<RecycleRecord[]>([]);
  const [stats, setStats] = useState(getStats());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'plastic' as RecycleRecord['type'], weight: 0, date: new Date().toISOString().split('T')[0] });
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => { setRecords(getRecords()); setStats(getStats()); };
  const showToast = (message: string) => { setToast({ message, visible: true }); setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.weight <= 0) return;
    const record = addRecord(form);
    setForm({ type: 'plastic', weight: 0, date: new Date().toISOString().split('T')[0] });
    setShowAdd(false);
    refreshData();
    showToast(`+${record.points} 포인트 적립! ♻️`);
  };

  // Landing
  if (view === 'landing') {
    const features = [
      { icon: Recycle, title: '재활용 기록', desc: '간편하게 재활용 배출 기록을 관리하세요' },
      { icon: Coins, title: '포인트 적립', desc: '재활용할수록 포인트가 쌓여요' },
      { icon: TreePine, title: 'CO2 절감', desc: '내가 지킨 환경, 수치로 확인하세요' },
      { icon: Globe, title: '환경 기여', desc: '작은 실천이 지구를 살립니다' },
    ];
    const testimonials = [
      { name: '김환경', role: '회사원', text: '재활용이 이렇게 보람찬 일인 줄 몰랐어요. 포인트도 쌓이고 뿌듯해요!', rating: 5 },
      { name: '이그린', role: '주부', text: '아이들과 함께 사용하니 환경교육에도 좋아요.', rating: 5 },
      { name: '박에코', role: '대학생', text: '한 달간 CO2 10kg 절감! 성취감이 대단해요.', rating: 5 },
    ];
    const pricing = [
      { name: 'Free', price: '무료', features: ['무제한 기록', '기본 통계', '월간 리포트'], cta: '무료 시작', popular: false },
      { name: 'Pro', price: '₩4,900/월', features: ['상세 분석', '포인트 상점', '친구 랭킹', '배지 시스템'], cta: '시작하기', popular: true },
      { name: 'Family', price: '₩9,900/월', features: ['가족 5명', '가족 합산 통계', '팀 챌린지'], cta: '시작하기', popular: false },
    ];

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-transparent" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl z-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 mb-6">
              <Recycle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">지구를 위한 작은 실천</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">재활용하면<br/><span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">포인트가 쌓여요</span></h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">재활용 배출을 기록하고 포인트를 모아보세요.<br/>내가 지킨 환경, 숫자로 확인할 수 있어요.</p>
            <motion.button onClick={() => setView('app')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-green-500/25">시작하기 →</motion.button>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8"><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>
        </section>

        <section className="py-24 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">핵심 기능</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4"><f.icon className="w-7 h-7 text-white" /></div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">사용자 후기</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />)}</div>
                  <p className="text-gray-300 mb-4">"{t.text}"</p>
                  <p className="font-bold">{t.name} <span className="text-gray-500 font-normal">· {t.role}</span></p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">요금제</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative bg-gray-800/50 border rounded-2xl p-6 ${p.popular ? 'border-green-500 scale-105' : 'border-gray-700'}`}>
                  {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-1 rounded-full">인기</div>}
                  <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                  <p className="text-3xl font-bold mb-6">{p.price}</p>
                  <ul className="space-y-3 mb-6">{p.features.map(f => <li key={f} className="flex items-center gap-2 text-gray-300"><Check className="w-5 h-5 text-green-400" />{f}</li>)}</ul>
                  <button onClick={() => setView('app')} className={`w-full py-3 rounded-lg font-bold ${p.popular ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gray-700 text-white'}`}>{p.cta}</button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-800 py-12 px-4 text-center text-gray-500 text-sm">© 2025 Recycling Manager. All rights reserved.</footer>
      </div>
    );
  }

  // App View
  const typeBreakdown = getTypeBreakdown();
  const monthlyData = getMonthlyData();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"><Recycle className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-bold">재활용 관리</h1>
          </div>
          <button onClick={() => setView('landing')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"><HomeIcon className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 text-center"><p className="text-xs text-gray-500">총 무게</p><p className="text-xl font-bold text-green-400">{stats.totalWeight}kg</p></div>
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 text-center"><p className="text-xs text-gray-500">포인트</p><p className="text-xl font-bold text-yellow-400">{stats.totalPoints.toLocaleString()}</p></div>
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 text-center"><p className="text-xs text-gray-500">CO2 절감</p><p className="text-xl font-bold text-teal-400">{stats.co2Saved}kg</p></div>
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 text-center"><p className="text-xs text-gray-500">기록</p><p className="text-xl font-bold text-purple-400">{stats.recordCount}회</p></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('record')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium ${tab === 'record' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}><Plus className="w-4 h-4" />기록</button>
          <button onClick={() => setTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium ${tab === 'history' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}><History className="w-4 h-4" />내역</button>
          <button onClick={() => setTab('stats')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium ${tab === 'stats' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}><Award className="w-4 h-4" />통계</button>
        </div>

        {tab === 'record' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(recycleTypes).map(([type, info]) => (
              <motion.button
                key={type}
                onClick={() => { setForm(f => ({ ...f, type: type as RecycleRecord['type'] })); setShowAdd(true); }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:border-green-500/50 transition-colors"
              >
                <div className="text-5xl mb-3">{info.icon}</div>
                <h3 className="font-bold mb-1">{info.name}</h3>
                <p className="text-xs text-gray-500">{info.pointsPerKg}P/kg</p>
              </motion.button>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-3">
            {records.map((r, i) => {
              const info = recycleTypes[r.type];
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 group">
                  <div className="text-3xl">{info.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="font-bold">{info.name}</span><span className="text-xs text-gray-500">{r.date}</span></div>
                    <p className="text-sm text-gray-400">{r.weight}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+{r.points}P</p>
                  </div>
                  <button onClick={() => { if (confirm('삭제하시겠습니까?')) { deleteRecord(r.id); refreshData(); } }} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold mb-4">종류별 배출량</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="weight" nameKey="name" label={({ name, value }) => `${name} ${value}kg`}>
                      {typeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold mb-4">월별 배출량</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                    <Bar dataKey="weight" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">재활용 기록</h2>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="text-center text-6xl mb-2">{recycleTypes[form.type].icon}</div>
                <p className="text-center font-bold text-xl">{recycleTypes[form.type].name}</p>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">무게 (kg)</label>
                  <input type="number" step="0.1" min="0" value={form.weight || ''} onChange={e => setForm(f => ({ ...f, weight: parseFloat(e.target.value) || 0 }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-center text-2xl" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">날짜</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
                </div>
                <p className="text-center text-green-400 font-bold">예상 포인트: +{Math.round(form.weight * recycleTypes[form.type].pointsPerKg)}P</p>
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 py-3 rounded-lg font-bold">기록하기</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }} className="fixed top-4 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-green-500/50 bg-green-500/10 backdrop-blur-sm">
            <Check className="w-5 h-5 text-green-400" /><span className="text-white text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
