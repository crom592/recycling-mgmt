import { Item } from '@/types/item';

const STORAGE_KEY = 'recycling-mgmt-items';

export function getItems(): Item[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveItems(items: Item[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: Omit<Item, 'id' | 'status' | 'createdAt'>): Item {
  const items = getItems();
  const newItem: Item = {
    ...item,
    id: crypto.randomUUID(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveItems(items);
  return newItem;
}

export function updateItem(id: string, updates: Partial<Item>): Item | null {
  const items = getItems();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  saveItems(items);
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = getItems();
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length === items.length) return false;
  saveItems(filtered);
  return true;
}

export function getActiveItems(): Item[] {
  return getItems().filter(i => i.status === 'active');
}

export function getStats() {
  const items = getItems();
  return {
    active: items.filter(i => i.status === 'active').length,
    completed: items.filter(i => i.status === 'completed').length,
    total: items.length,
  };
}
