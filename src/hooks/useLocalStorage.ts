// Local storage hook for persisting settings and stats

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get stored value or use initial
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Persist to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Settings type
export interface AppSettings {
  key: string;
  preferFlats: boolean;
  progressionId: string;
  bars: number;
  style: 'accompaniment' | 'solo';
  voicingStyles: string[];
  smooth: boolean;
  autoAdvance: boolean;
  autoAdvanceTempo: number; // BPM
  randomKeyPerLoop: boolean;
  hideNotes: boolean;
  difficulty: number; // 1-5
}

export const DEFAULT_SETTINGS: AppSettings = {
  key: 'C',
  preferFlats: true,
  progressionId: 'ii-v-i-major',
  bars: 4,
  style: 'accompaniment',
  voicingStyles: ['shell', 'rootless-a'],
  smooth: true,
  autoAdvance: false,
  autoAdvanceTempo: 60,
  randomKeyPerLoop: false,
  hideNotes: false,
  difficulty: 2
};

// Stats type
export interface AppStats {
  sessionsToday: number;
  lastSessionDate: string;
  minutesThisWeek: number;
  weekStartDate: string;
  totalSessions: number;
}

export const DEFAULT_STATS: AppStats = {
  sessionsToday: 0,
  lastSessionDate: '',
  minutesThisWeek: 0,
  weekStartDate: '',
  totalSessions: 0
};

// Helper to get week start date (Monday)
function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Helper to get today's date
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Custom hook for app settings
export function useSettings() {
  return useLocalStorage<AppSettings>('jazz-practice-settings', DEFAULT_SETTINGS);
}

// Custom hook for app stats
export function useStats() {
  const [stats, setStats] = useLocalStorage<AppStats>('jazz-practice-stats', DEFAULT_STATS);

  const recordSession = useCallback((durationMinutes: number) => {
    const today = getToday();
    const weekStart = getWeekStart();

    setStats(prev => {
      // Reset daily count if new day
      const sessionsToday = prev.lastSessionDate === today ? prev.sessionsToday + 1 : 1;

      // Reset weekly minutes if new week
      const minutesThisWeek = prev.weekStartDate === weekStart
        ? prev.minutesThisWeek + durationMinutes
        : durationMinutes;

      return {
        sessionsToday,
        lastSessionDate: today,
        minutesThisWeek,
        weekStartDate: weekStart,
        totalSessions: prev.totalSessions + 1
      };
    });
  }, [setStats]);

  // Check and reset if needed on mount
  useEffect(() => {
    const today = getToday();
    const weekStart = getWeekStart();

    setStats(prev => {
      let updated = { ...prev };

      if (prev.lastSessionDate !== today) {
        updated.sessionsToday = 0;
      }

      if (prev.weekStartDate !== weekStart) {
        updated.minutesThisWeek = 0;
        updated.weekStartDate = weekStart;
      }

      return updated;
    });
  }, [setStats]);

  return { stats, recordSession };
}
