export interface RecycleRecord {
  id: string;
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronics' | 'clothes';
  weight: number;
  points: number;
  date: string;
  createdAt: string;
}

export interface DashboardStats {
  totalWeight: number;
  totalPoints: number;
  co2Saved: number;
  recordCount: number;
}
