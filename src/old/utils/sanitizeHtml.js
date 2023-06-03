import sanitize from 'sanitize-html';

export const sanitizeHtml = (html) =>
  sanitize(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'small', 'br'],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'class', 'data-testid'],
      small: ['class'],
    },
  });
