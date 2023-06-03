import {
  getNotifier,
  hideAlert,
  hideLoading,
  showAlert,
  showError,
  showLoading,
  showSuccess,
  showWarning,
} from '..';
import store from '../../store';
import { initialState } from '../reducer';

describe('notifier/reducer', () => {
  const date = new Date();
  const _Date = Date;

  beforeEach(() => {
    global.Date = jest.fn(() => date);
    global.Date.getTime = _Date.getTime;
  });

  afterEach(() => {
    global.Date = _Date;
    store.dispatch(hideAlert());
  });

  describe('showAlert', () => {
    afterEach(() => {
      store.dispatch(hideAlert());
    });

    it('should update message', () => {
      store.dispatch(showAlert({ message: 'message' }));

      const received = getNotifier(store.getState());
      const expected = {
        ...initialState,
        isAlert: true,
        id: date.getTime(),
        message: 'message',
      };

      expect(received).toEqual(expected);
    });

    it('should update color', () => {
      store.dispatch(showAlert({ color: 'warn' }));

      const received = getNotifier(store.getState());
      const expected = {
        ...initialState,
        isAlert: true,
        id: date.getTime(),
        color: 'warn',
      };

      expect(received).toEqual(expected);
    });

    it('should update isRedirect', () => {
      store.dispatch(showAlert({ isRedirect: true }));

      const received = getNotifier(store.getState());
      const expected = {
        ...initialState,
        isAlert: true,
        isRedirect: true,
        id: date.getTime(),
      };

      expect(received).toEqual(expected);
    });

    it('should update isScroll', () => {
      store.dispatch(showAlert({ isScroll: false }));

      const received = getNotifier(store.getState());
      const expected = {
        ...initialState,
        isAlert: true,
        isScroll: false,
        id: date.getTime(),
      };

      expect(received).toEqual(expected);
    });

    it('should not update keys that dont exist', () => {
      store.dispatch(showAlert({ foo: 'bar' }));

      const received = getNotifier(store.getState());
      const expected = {
        ...initialState,
        isAlert: true,
        id: date.getTime(),
      };

      expect(received).toEqual(expected);
    });
  });

  describe('showError', () => {
    afterEach(() => {
      store.dispatch(hideAlert());
    });

    it('should set state with color danger', () => {
      store.dispatch(showError({ message: 'message' }));

      const received = getNotifier(store.getState()).color;
      const expected = 'danger';

      expect(received).toEqual(expected);
    });

    it('should set state with message as object', () => {
      store.dispatch(showError({ message: 'message' }));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });

    it('should set state with message as string', () => {
      store.dispatch(showError('message'));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });
  });

  describe('showSuccess', () => {
    afterEach(() => {
      store.dispatch(hideAlert());
    });

    it('should update state with color success', () => {
      store.dispatch(showSuccess({ message: 'message' }));

      const received = getNotifier(store.getState()).color;
      const expected = 'success';

      expect(received).toEqual(expected);
    });

    it('should set state with message object', () => {
      store.dispatch(showSuccess({ message: 'message' }));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });

    it('should set state with message as string', () => {
      store.dispatch(showSuccess('message'));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });
  });

  describe('showWarning', () => {
    afterEach(() => {
      store.dispatch(hideAlert());
    });

    it('should update state with color success', () => {
      store.dispatch(showWarning({ message: 'message' }));

      const received = getNotifier(store.getState()).color;
      const expected = 'warning';

      expect(received).toEqual(expected);
    });

    it('should set state with message', () => {
      store.dispatch(showWarning({ message: 'message' }));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });

    it('should set state with message as string', () => {
      store.dispatch(showWarning('message'));

      const received = getNotifier(store.getState()).message;
      const expected = 'message';

      expect(received).toEqual(expected);
    });
  });

  describe('hideAlert', () => {
    it('should return the initialState', () => {
      store.dispatch(showAlert());
      store.dispatch(hideAlert());

      const received = getNotifier(store.getState());
      const expected = initialState;

      expect(received).toEqual(expected);
    });

    it('should retain the isLoading state', () => {
      store.dispatch(showLoading());
      store.dispatch(hideAlert());

      const received = getNotifier(store.getState()).isLoading;
      const expected = true;

      expect(received).toEqual(expected);
    });
  });

  describe('showLoading', () => {
    it('should update isLoading', () => {
      store.dispatch(showLoading());

      const received = getNotifier(store.getState());
      const expected = { ...initialState, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  describe('hideLoading', () => {
    it('should return isLoading as false', () => {
      store.dispatch(showLoading());
      store.dispatch(hideLoading());

      const received = getNotifier(store.getState()).isLoading;
      const expected = false;

      expect(received).toEqual(expected);
    });

    it('should retain the isAlert state', () => {
      store.dispatch(showLoading());
      store.dispatch(showAlert());
      store.dispatch(hideLoading());

      const received = getNotifier(store.getState()).isAlert;
      const expected = true;

      expect(received).toEqual(expected);
    });
  });
});
