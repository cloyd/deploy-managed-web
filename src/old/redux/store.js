import { configureStore } from '@reduxjs/toolkit';
import { createLogic, createLogicMiddleware } from 'redux-logic';

// Utils
import { httpClient } from '../utils';
import agency, { logic as agencyLogic } from './agency';
import assembly, { logic as assemblyLogic } from './assembly';
import attachment, { logic as attachmentLogic } from './attachment';
import company, { logic as companyLogic } from './company';
import dashboard, { dashboardLogic } from './dashboard';
import inspection, { inspectionLogic } from './inspection';
import intention, { logic as intentionLogic } from './intention';
import lease, { logic as leaseLogic } from './lease';
import marketplace, { marketplaceLogic } from './marketplace';
// Middleware
import { validateAuthToken } from './middleware';
// Reducers & Logic
import notifier from './notifier';
import oauth, { logic as oauthLogic } from './oauth';
import pagination from './pagination';
import profile, { logic as profileLogic } from './profile';
import property, { logic as propertyLogic } from './property';
import report, { reportLogic } from './report';
import settings, { logic as settingsLogic } from './settings';
import task, { logic as taskLogic } from './task';
import users, { usersLogic } from './users';

// Combine reducers
const reducer = {
  notifier,
  agency,
  assembly,
  attachment,
  company,
  dashboard,
  inspection,
  intention,
  lease,
  marketplace,
  oauth,
  pagination,
  profile,
  property,
  report,
  settings,
  task,
  users,
};

// Combine logic
const logic = [
  ...agencyLogic,
  ...assemblyLogic,
  ...attachmentLogic,
  ...companyLogic,
  ...dashboardLogic,
  ...inspectionLogic,
  ...intentionLogic,
  ...leaseLogic,
  ...marketplaceLogic,
  ...oauthLogic,
  ...profileLogic,
  ...propertyLogic,
  ...settingsLogic,
  ...taskLogic,
  ...usersLogic,
].map(createLogic);

// Update logic using react-starter-kit
logic.push(...reportLogic);

// Create logic middleware
const middleware = [
  createLogicMiddleware(logic, { httpClient }),
  validateAuthToken,
];

// Create the store
export default configureStore({
  reducer,
  middleware,
});
