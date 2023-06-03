import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchMarketplaceTags,
  getMarketplaceTags,
} from '@app/redux/marketplace';

/**
 * Hook that returns filter-formatted marketplace tags
 * Should call redux action fetchMarketplaceTags if tags aren't populated
 *
 * @returns {Object[]} marketplaceTagFormOptions - meant for forms such as search filters
 * @returns {Object} marketplaceTagValues - allows easy access to labels
 */
export const useMarketplaceTags = () => {
  const dispatch = useDispatch();

  const tags = useSelector((state) => {
    return getMarketplaceTags(state.marketplace) || [];
  });

  const [canFetch, setCanFetch] = useState(!tags.length);

  useEffect(() => {
    if (canFetch) {
      dispatch(fetchMarketplaceTags());
      setCanFetch(false);
    }
  }, [dispatch, canFetch, setCanFetch]);

  const marketplaceTagFormOptions = useMemo(() => {
    return tags.map((tag) => {
      return { label: tag.name, value: tag.id };
    });
  }, [tags]);

  const marketplaceTagValues = useMemo(() => {
    return tags.reduce((acc, tag) => {
      return { ...acc, [tag.id]: tag.name };
    }, {});
  }, [tags]);

  return { marketplaceTagFormOptions, marketplaceTagValues };
};

/**
 * Given an array of tagIds, return a formatted string
 *
 * @param {number[]} tagIds
 * @returns {Array} filtered array of marketplace tags
 */
export const useMarketplaceTagsForIds = (tagIds = []) => {
  const { marketplaceTagValues: tags } = useMarketplaceTags();

  return useMemo(() => {
    if (tags && !!tagIds.length) {
      return tagIds.map((tagId) => tags[tagId]);
    }

    return [];
  }, [tags, tagIds]);
};

/**
 * Given an array of tagIds, return a formatted string
 *
 * @param {number[]} tagIds
 * @returns {String} comma seperated list of tags
 */
export const useMarketplaceTagsToString = (tagIds = []) => {
  const tags = useMarketplaceTagsForIds(tagIds);
  return useMemo(() => tags.join(', '), [tags]);
};
