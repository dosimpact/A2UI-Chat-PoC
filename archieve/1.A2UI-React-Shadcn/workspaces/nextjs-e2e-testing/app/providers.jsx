'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SurfaceContext = createContext(null);

const PLACEHOLDER_SURFACE = 'Viewer placeholder surface';

export function SurfaceProvider({ children }) {
  const [surface, setSurface] = useState(PLACEHOLDER_SURFACE);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('next-surface-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSurface(parsed.surface ?? PLACEHOLDER_SURFACE);
        setStatus(parsed.status ?? 'idle');
        setError(parsed.error ?? '');
      }
    } catch {
      setSurface(PLACEHOLDER_SURFACE);
      setStatus('idle');
      setError('');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    sessionStorage.setItem(
      'next-surface-state',
      JSON.stringify({
        surface,
        status,
        error
      })
    );
  }, [surface, status, error, hydrated]);

  const value = useMemo(
    () => ({
      surface,
      status,
      error,
      hydrated,
      setSurface,
      setStatus,
      setError
    }),
    [surface, status, error, hydrated]
  );

  return <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>;
}

export function useSurface() {
  const value = useContext(SurfaceContext);
  if (!value) {
    throw new Error('useSurface must be used within SurfaceProvider');
  }
  return value;
}
