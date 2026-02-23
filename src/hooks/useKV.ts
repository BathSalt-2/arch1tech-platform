import { useState } from 'react';

export function useKV<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`arch1tech-${key}`);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setKV = (newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(`arch1tech-${key}`, JSON.stringify(newValue));
    } catch {}
  };

  return [value, setKV];
}
