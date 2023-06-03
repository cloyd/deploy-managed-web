import sortBy from 'lodash/fp/sortBy';
import { useMemo } from 'react';

/**
 * Sorts given array by 'position'. This is intended for use with models that use the acts_as_list gem.
 *
 * @param {Object[]} items array of objects with a 'position' param
 */
export const useSortByPosition = (items = []) =>
  useMemo(() => (items ? sortBy(['position'], items) : []), [items]);
