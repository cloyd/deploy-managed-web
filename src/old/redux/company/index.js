import { reducer } from './reducer';

export default reducer;
export { initialState } from './reducer';
export { logic } from './logic';

// Actions
export { fetchCompany, updateCompany } from './actions';

// Selectors
export {
  getAgencyCompany,
  getCompany,
  getOwnerCompany,
  selectCompanyIsLoading,
} from './selectors';
