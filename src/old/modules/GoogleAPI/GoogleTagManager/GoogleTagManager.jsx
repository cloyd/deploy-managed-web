import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { setDataLayer } from './gtm';

export const GoogleTagManager = () => {
  const location = useLocation();

  useEffect(() => {
    setDataLayer();
  }, [location]);

  return <></>;
};
