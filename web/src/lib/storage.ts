import { HistoryItem } from '@/types';

const STORAGE_KEY = 'leetcode_visualizer_history';

export const saveHistory = (item: Omit<HistoryItem, 'timestamp'>): HistoryItem => {
  const history = getHistory();
  const newItem = { ...item, timestamp: Date.now() };
  
  // Check if item already exists (simple duplicate check by id)
  const existingIndex = history.findIndex(h => h.id === newItem.id);
  if (existingIndex >= 0) {
    // Update existing
    history[existingIndex] = { ...history[existingIndex], ...newItem };
  } else {
    // Add new
    history.unshift(newItem);
  }

  // Limit history size to 50
  if (history.length > 50) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newItem;
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const toggleFavorite = (id: string): HistoryItem[] => {
  const history = getHistory();
  const index = history.findIndex(h => h.id === id);
  if (index >= 0) {
    history[index].isFavorite = !history[index].isFavorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  return history;
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const newHistory = history.filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return newHistory;
};
