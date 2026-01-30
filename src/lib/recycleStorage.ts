import { RecycleRecord, DashboardStats } from '@/types/recycling';

const STORAGE_KEY = 'recycling-records';

const demoRecords: RecycleRecord[] = [
  { id: '1', type: 'plastic', weight: 2.5, points: 250, date: '2025-01-30', createdAt: '2025-01-30T10:00:00' },
  { id: '2', type: 'paper', weight: 5.0, points: 400, date: '2025-01-29', createdAt: '2025-01-29T11:00:00' },
  { id: '3', type: 'metal', weight: 1.2, points: 360, date: '2025-01-28', createdAt: '2025-01-28T09:00:00' },
  { id: '4', type: 'glass', weight: 3.0, points: 180, date: '2025-01-27', createdAt: '2025-01-27T14:00:00' },
  { id: '5', type: 'electronics', weight: 0.5, points: 500, date: '2025-01-26', createdAt: '2025-01-26T15:00:00' },
  { id: '6', type: 'clothes', weight: 2.0, points: 200, date: '2025-01-25', createdAt: '2025-01-25T16:00:00' },
  { id: '7', type: 'plastic', weight: 1.8, points: 180, date: '2025-01-24', createdAt: '2025-01-24T10:00:00' },
  { id: '8', type: 'paper', weight: 3.5, points: 280, date: '2025-01-23', createdAt: '2025-01-23T11:00:00' },
];

export const recycleTypes = {
  plastic: { name: '플라스틱', icon: '♻️', color: 'bg-blue-500', pointsPerKg: 100 },
  paper: { name: '종이', icon: '📄', color: 'bg-yellow-500', pointsPerKg: 80 },
  glass: { name: '유리', icon: '🫙', color: 'bg-green-500', pointsPerKg: 60 },
  metal: { name: '금속', icon: '🥫', color: 'bg-gray-500', pointsPerKg: 300 },
  electronics: { name: '전자제품', icon: '📱', color: 'bg-purple-500', pointsPerKg: 1000 },
  clothes: { name: '의류', icon: '👕', color: 'bg-pink-500', pointsPerKg: 100 },
};

export function getRecords(): RecycleRecord[] {
  if (typeof window === 'undefined') return demoRecords;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) { saveRecords(demoRecords); return demoRecords; }
  return JSON.parse(data);
}

export function saveRecords(records: RecycleRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: Omit<RecycleRecord, 'id' | 'points' | 'createdAt'>): RecycleRecord {
  const records = getRecords();
  const typeInfo = recycleTypes[record.type];
  const newRecord: RecycleRecord = {
    ...record,
    id: crypto.randomUUID(),
    points: Math.round(record.weight * typeInfo.pointsPerKg),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  saveRecords(records);
  return newRecord;
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter(r => r.id !== id);
  saveRecords(records);
}

export function getStats(): DashboardStats {
  const records = getRecords();
  const totalWeight = records.reduce((s, r) => s + r.weight, 0);
  const totalPoints = records.reduce((s, r) => s + r.points, 0);
  return {
    totalWeight: Math.round(totalWeight * 10) / 10,
    totalPoints,
    co2Saved: Math.round(totalWeight * 2.5 * 10) / 10, // 1kg = 2.5kg CO2
    recordCount: records.length,
  };
}

export function getTypeBreakdown(): { type: string; name: string; weight: number; icon: string }[] {
  const records = getRecords();
  return Object.entries(recycleTypes).map(([type, info]) => ({
    type,
    name: info.name,
    icon: info.icon,
    weight: Math.round(records.filter(r => r.type === type).reduce((s, r) => s + r.weight, 0) * 10) / 10,
  })).filter(t => t.weight > 0);
}

export function getMonthlyData(): { month: string; weight: number }[] {
  const records = getRecords();
  const months: Record<string, number> = {};
  records.forEach(r => {
    const month = r.date.substring(5, 7) + '월';
    months[month] = (months[month] || 0) + r.weight;
  });
  return Object.entries(months).map(([month, weight]) => ({ month, weight: Math.round(weight * 10) / 10 }));
}
