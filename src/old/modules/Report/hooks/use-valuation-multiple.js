import { useState } from 'react';
import localStorage from 'store';

import { useOnce } from '../../../hooks';

export const useValuationMultiple = () => {
  const [multiple, setMultiple] = useState(1);

  const updateMultiple = (value) => {
    const newMultiple =
      !value || typeof value !== 'number' || value <= 0 ? 1 : value;

    setMultiple(newMultiple);
    localStorage.set('report-overview', { multiple: newMultiple });
  };

  useOnce(() => {
    const store = localStorage.get('report-overview');

    if (store && store.multiple) {
      setMultiple(store.multiple);
    }
  });

  return [multiple, updateMultiple];
};
