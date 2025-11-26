import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}`
      : '/api',
  credentials: 'include', // при необходимости
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
  responseHandler: async (response) => {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();

    if (!text && response.status >= 200 && response.status < 300) {
      return {};
    }

    return text;
  },
});

export const baseApi = createApi({
  baseQuery,
  reducerPath: 'api',
  tagTypes: ['Auth', 'User', 'Accounts', 'Transactions', 'Session'],
  endpoints: () => ({}),
});
