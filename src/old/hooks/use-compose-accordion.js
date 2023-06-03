import animateScrollTo from 'animated-scroll-to';
import { useEffect, useMemo, useReducer, useRef } from 'react';

const defaultState = {
  openIndex: null,
  size: 0,
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CLOSE':
      return {
        ...state,
        openIndex: null,
      };

    case 'INIT_STATE':
      return {
        ...defaultState,
        size: payload.size,
      };

    case 'NEXT': {
      const { index } = payload;

      return {
        ...state,
        openIndex: index < state.size - 1 ? index + 1 : index,
      };
    }

    case 'OPEN':
      return { ...state, openIndex: payload.index };

    case 'RESET_STATE':
      return { ...defaultState };

    default:
      return { ...state };
  }
};

export const useComposeAccordion = (initState = defaultState) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const sectionsRef = useRef([]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Scroll into view when a new section is opened
    // Only occurs if the section ref has been added via the handleRef callback below
    if (sectionsRef.current.length > 0 && state.openIndex >= 0) {
      const sectionElement = sectionsRef.current[state.openIndex];

      if (sectionElement) {
        animateScrollTo(sectionElement, {
          offset: window.innerWidth > 576 ? -80 : -130,
        });
      }
    }
  }, [state.openIndex]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const actions = useMemo(
    () => ({
      handleRef: (index) => (el) => {
        sectionsRef.current[index] = el;
      },
      close: (index) => {
        dispatch({ type: 'CLOSE', payload: { index } });
      },
      initState: (size) => {
        dispatch({ type: 'INIT_STATE', payload: { size } });
      },
      next: (index) => {
        dispatch({ type: 'NEXT', payload: { index } });
      },
      open: (index) => {
        dispatch({ type: 'OPEN', payload: { index } });
      },
      resetState: () => {
        dispatch({ type: 'RESET_STATE' });
      },
    }),
    [dispatch]
  );
  return [state, actions];
};
