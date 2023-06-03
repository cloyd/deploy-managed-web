import { useCallback, useMemo } from 'react';

import { replaceSearchParams } from '../../utils';

// Returns array of pagination numbers
// e.g. { currentPage: 5, maxPagesShown: 3, totalPages: 5 }
// gives [3, 4, 5]
export const getPageNumbers = ({ currentPage, maxPagesShown, totalPages }) => {
  const distance = Math.floor(maxPagesShown / 2);
  const firstOffset = currentPage - distance;
  const lastOffset = currentPage + distance - 1 + (maxPagesShown % 2);

  let firstPage = firstOffset;
  let lastPage = lastOffset;
  let range = [];

  if (firstPage < 1) {
    firstPage = 1;
    lastPage = lastOffset + (1 - firstOffset);
    lastPage = lastPage > totalPages ? totalPages : lastPage;
  } else if (lastPage > totalPages) {
    lastPage = totalPages;
    firstPage =
      firstOffset - (lastOffset - totalPages) + 1 - (maxPagesShown % 2);
    firstPage = firstPage < 1 ? 1 : firstPage;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    range.push(i);
  }

  return range;
};

// Returns memo list of pagination items in the format:
// {
//   isActive: boolean,
//   isDisabled: boolean,
//   label: string,
//   href: string,
// }
export const usePagination = (props) => {
  const { location, maxPagesShown, pagination } = props;

  // Replaces ?page with new page param value
  const getPagePath = useCallback(
    (page) =>
      replaceSearchParams({
        params: { page },
        pathname: location.pathname,
        search: location.search,
      }),
    [location.pathname, location.search]
  );

  return useMemo(() => {
    const { page, totalPages } = pagination;

    const numbers = getPageNumbers({
      currentPage: page,
      maxPagesShown,
      totalPages,
    });

    const pageItems = numbers.map((i) => ({
      isActive: i === page,
      isDisabled: false,
      label: `${i}`,
      href: getPagePath(i),
    }));

    return [
      {
        isActive: false,
        isDisabled: page === 1,
        label: 'First',
        href: getPagePath(1),
      },
      {
        isActive: false,
        isDisabled: page === 1,
        label: 'Previous',
        href: getPagePath(page - 1),
      },
      ...pageItems,
      {
        isActive: false,
        isDisabled: page === totalPages,
        label: 'Next',
        href: getPagePath(page + 1),
      },
      {
        isActive: false,
        isDisabled: page === totalPages,
        label: 'Last',
        href: getPagePath(totalPages),
      },
    ];
  }, [getPagePath, maxPagesShown, pagination]);
};
