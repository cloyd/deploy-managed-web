import snakeCase from 'lodash/fp/snakeCase';
import { useMemo } from 'react';

const DEFAULT_TYPES = Object.freeze(['maintenance', 'general']);

/**
 * Filters list of task types based on user role
 *
 * @param {*} taskMeta - store.task.meta
 * @param {*} isManager
 * @param {*} filter - optionally filter additional types
 */
export const useTaskTypes = (taskMeta, isManager, filter = []) =>
  useMemo(() => {
    const types = isManager ? Object.keys(taskMeta) : DEFAULT_TYPES;
    const filterValues = ['invoice', ...filter];

    return types
      .map((value) => (value === 'arrear' ? 'arrears' : snakeCase(value)))
      .filter((value) => filterValues.indexOf(value) === -1);
  }, [filter, isManager, taskMeta]);
