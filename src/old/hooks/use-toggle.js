import { useCallback, useState } from 'react';

export const useToggle = (
  initialState = {
    isOpen: false,
  }
) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  const toggle = useCallback((params) => {
    setState((state) => params || { ...state, isOpen: !state.isOpen });
  }, []);

  return [state, toggle];
};
