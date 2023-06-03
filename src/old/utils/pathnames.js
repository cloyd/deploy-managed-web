// Pathname for previous page, e.g. from /area/1/item/2 to /area/1/
export const pathnameBack = (pathname) =>
  pathname ? pathname.replace(/\/[^/]+\/[^/]*$/, '') : pathname;

// Pathname with updated slug, e.g. from /area/1/item/2 to /area/1/item/3
export const pathnameUpdateSlug = (pathname, slug = '') =>
  pathname ? pathname.replace(/[^/]*$/, slug) : pathname;
