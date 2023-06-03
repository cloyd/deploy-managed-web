// React
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import localStorage from 'store';

// The App
import { App, Loading } from '.';
import { useOnce } from '../hooks';
import { initializeGtm } from '../modules/GoogleAPI';
import QueryProvider from '../modules/QueryProvider';
import { fetchProfile, setStoreAuthToken } from '../redux/profile';
// Connect the Redux Store with httpClient
import store from '../redux/store';
// Application Styles
import '../styles/application.scss';
// Add the fontawesome icons
import '../utils/fontAwesomeLibrary';
import { connectHttpClient } from '../utils/httpClient';
// Add custom validations
import '../utils/yupAddMethods';

// Connect the httpClient with the store
connectHttpClient(store);

// If an authToken exists in localStorage
// - attempt to fetch profile
// - set token in the store
const authToken = localStorage.get('authToken');

if (authToken) {
  store.dispatch(fetchProfile());
  store.dispatch(setStoreAuthToken(authToken));
}

// When the component mounts if user.isLoading then fetchProfile has
// fired and we need to wait till its completed before rendering the app.
// This prevents screen flashes and unwanted redirects.
export const AppWithProvider = () => {
  const [isAppLoading, setIsAppLoading] = useState(
    store.getState().profile.isLoading
  );

  useEffect(() => {
    let unsubscribe;

    if (isAppLoading) {
      unsubscribe = store.subscribe(() => {
        const { isLoading } = store.getState().profile;

        if (!isLoading) {
          unsubscribe();
          setIsAppLoading(isLoading);
        }
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [isAppLoading, setIsAppLoading]);

  useOnce(() => {
    initializeGtm();
  });

  return (
    <Provider store={store}>
      <QueryProvider>
        <div className="h-100 w-100">
          <Loading />
          <App isReady={!isAppLoading} />
        </div>
      </QueryProvider>
    </Provider>
  );
};
