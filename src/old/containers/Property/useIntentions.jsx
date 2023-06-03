import uniqBy from 'lodash/fp/uniqBy';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchIntentionsCompleted,
  fetchIntentionsPayable,
  getIntentionsForProperty,
} from '../../redux/intention';

export const PAGE_SIZE = 10;

const initialState = {
  list: [],
  isFetching: false,
  shouldLoadMore: false,
  initialLoad: true,
  page: 1,
};

const LOAD_MORE = 'load_more';
const LOAD_MORE_SUCCESS = 'load_more_success';
const RESET = 'reset';
const INITIAL_LOAD = 'initial_load';
const INITIAL_LOAD_SUCCESS = 'initial_load_success';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_MORE:
      return {
        ...state,
        page: action.payload.page,
        shouldLoadMore: true,
        isFetching: true,
      };
    case LOAD_MORE_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        isFetching: false,
      };
    case INITIAL_LOAD:
      return {
        ...state,
        isFetching: true,
        initialLoad: true,
      };
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        initialLoad: false,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

const useIntentions = ({ type = 'payable', property, leaseId }) => {
  const dispatch = useDispatch();
  const { isLoading, intentionToDelete, payableLoading, completedLoading } =
    useSelector((state) => state.intention);

  const intentions = useSelector((state) =>
    getIntentionsForProperty(state.intention, property.id)
  );

  const intentionList = useMemo(() => intentions[type], [type, intentions]);
  const [
    { isFetching, page, list, shouldLoadMore, initialLoad },
    dispatchReducer,
  ] = useReducer(reducer, initialState);

  const onLoadMore = useCallback(() => {
    if (!isFetching) {
      const nextPage = page + 1;

      dispatchReducer({
        type: LOAD_MORE,
        payload: {
          page: nextPage,
        },
      });

      const fetcher =
        type === 'completed'
          ? fetchIntentionsCompleted
          : fetchIntentionsPayable;

      dispatch(
        fetcher({
          ...(!leaseId === property.leaseId && { leaseId }),
          propertyId: property.id,
          property,
          perPage: PAGE_SIZE,
          page: nextPage,
        })
      );
    }
  }, [isFetching, page, type, dispatch, leaseId, property]);

  const refetch = useCallback(() => {
    if (!isFetching) {
      const fetcher =
        type === 'completed'
          ? fetchIntentionsCompleted
          : fetchIntentionsPayable;

      dispatch(
        fetcher({
          ...(!leaseId === property.leaseId && { leaseId }),
          propertyId: property.id,
          property,
          perPage: PAGE_SIZE,
          page,
        })
      );
    }
  }, [isFetching, page, type, dispatch, leaseId, property]);

  const updateList = useCallback((modifiedList) => {
    dispatchReducer({
      type: LOAD_MORE_SUCCESS,
      payload: {
        list: modifiedList,
      },
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const updatedList = uniqBy('id', [...list, ...intentionList]);

      if (
        initialLoad &&
        ((type === 'payable' && !payableLoading) ||
          (type === 'completed' && !completedLoading))
      ) {
        dispatchReducer({ type: INITIAL_LOAD_SUCCESS });
      }

      dispatchReducer({
        type: LOAD_MORE_SUCCESS,
        payload: {
          list: shouldLoadMore ? updatedList : intentionList,
        },
      });
    }
    // NOTE: prevent react maximum update depth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentionList.length, isLoading, payableLoading, completedLoading]);

  // for deleting transaction
  useEffect(() => {
    if (intentionToDelete) {
      const updatedList = list.filter(({ id }) => id !== intentionToDelete);

      dispatchReducer({
        type: LOAD_MORE_SUCCESS,
        payload: {
          list: updatedList,
        },
      });
    }
  }, [intentionToDelete, list]);

  useEffect(() => {
    dispatchReducer({ type: INITIAL_LOAD });

    return () => {
      dispatchReducer({
        type: RESET,
      });
    };
  }, []);

  return [
    { isFetching, page, list, initialLoad },
    { onLoadMore, updateList, refetch },
  ];
};

export default useIntentions;
