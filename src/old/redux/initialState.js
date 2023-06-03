//
// Initial state of the redux store - intended for use in tests
import { initialState as agency } from './agency/reducer';
import { initialState as assembly } from './assembly/reducer';
import { initialState as attachment } from './attachment/reducer';
import { initialState as company } from './company/reducer';
import { initialState as dashboard } from './dashboard/reducer';
import { initialState as inspection } from './inspection/reducer';
import { initialState as intention } from './intention/reducer';
import { initialState as lease } from './lease/reducer';
import { initialState as marketplace } from './marketplace/reducer';
import { initialState as notifier } from './notifier/reducer';
import { initialState as pagination } from './pagination/reducer';
import { initialState as profile } from './profile/reducer';
import { initialState as property } from './property/reducer';
import { initialState as report } from './report/reducer';
import { initialState as settings } from './settings/reducer';
import { initialState as task } from './task/reducer';
import { initialState as users } from './users/reducer';

export const initialState = {
  agency,
  assembly,
  attachment,
  company,
  dashboard,
  inspection,
  intention,
  lease,
  marketplace,
  notifier,
  pagination,
  profile,
  property,
  report,
  settings,
  task,
  users,
};
