import { useCallback } from 'react';

export const usePrint = () => useCallback(() => window.print(), []);
