import MockAdapter from 'axios-mock-adapter';

import { httpClient, httpOauthClient } from '../../utils';

export const mockHttpClient = new MockAdapter(httpClient);
export const mockHttpOauthClient = new MockAdapter(httpOauthClient);
