import { useMemo } from 'react';

export const useDownloadLinks = (baseUrl, filename) =>
  useMemo(() => {
    return {
      csv: {
        url: `${baseUrl}.csv`,
        filename: `${filename}.csv`,
      },
      pdf: {
        url: `${baseUrl}.pdf`,
        filename: `${filename}.pdf`,
      },
    };
  }, [baseUrl, filename]);
