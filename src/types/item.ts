export interface Item {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, string>;
}
