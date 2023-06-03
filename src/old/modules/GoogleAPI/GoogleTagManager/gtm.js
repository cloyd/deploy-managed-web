import TagManager from 'react-gtm-module';
import localStorage from 'store';

export const initializeGtm = () => {
  if (import.meta.env.MANAGED_APP_MANGED_APP_GMT) {
    const dataLayer = {
      agencyId: localStorage.get('agencyId'),
      userType: localStorage.get('userType'),
    };

    TagManager.initialize({
      gtmId: import.meta.env.MANAGED_APP_MANGED_APP_GMT,
      dataLayer,
    });
  }
};

export const setDataLayer = () => {
  const dataLayer = {
    agencyId: localStorage.get('agencyId'),
    userType: localStorage.get('userType'),
  };

  TagManager.dataLayer({ dataLayer });
};
