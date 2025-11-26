import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Session } from '../../../types/sessions.ts';
import { baseApi } from '../baseApi.ts';

type CreateSessionRequest = {
  description: string;
};

type CreateAccessLinkRequest = {
  sessionId: string;
  candidateName: string;
};

type AccessLinkResponse = {
  accessToken: string;
  accessUrl: string;
  candidateName: string;
};

type StartSessionResponse = {
  alreadyStarted: boolean;
  message: string;
};

// Публичный baseQuery без авторизации
const publicBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}`
    : 'http://localhost:8080/api',
  credentials: 'include',
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

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation<Session, CreateSessionRequest>({
      query: (body) => ({
        url: '/session/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Session'],
    }),
    getAllSessions: build.query<Session[], void>({
      query: () => ({
        url: '/session/allSessions',
        method: 'GET',
      }),
      providesTags: ['Session'],
    }),
    getSession: build.query<Session, string>({
      query: (sessionId) => ({
        url: `/session/get/${sessionId}`,
        method: 'GET',
      }),
      providesTags: ['Session'],
    }),
    createAccessLink: build.mutation<AccessLinkResponse, CreateAccessLinkRequest>({
      query: (body) => ({
        url: '/session/createAccessLink',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Session'],
    }),
    // Публичные эндпоинты (без авторизации)
    getSessionByToken: build.query<Session, string>({
      queryFn: async (accessToken) => {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
          // Экранируем токен для URL
          const encodedToken = encodeURIComponent(accessToken);
          const url = `${baseUrl}/public/session/${encodedToken}`;
          
          // eslint-disable-next-line no-console
          console.log('Fetching session by token:', url);

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            const errorText = await response.text();
            // eslint-disable-next-line no-console
            console.error('Error response:', response.status, errorText);
            return {
              error: {
                status: response.status,
                data: errorText || `HTTP ${response.status}: ${response.statusText}`,
              },
            };
          }

          const data = await response.json();
          // eslint-disable-next-line no-console
          console.log('Session data received:', data);
          return { data: data as Session };
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Exception in getSessionByToken:', err);
          return {
            error: {
              status: 'FETCH_ERROR',
              data: err instanceof Error ? err.message : 'Unknown error',
            },
          };
        }
      },
    }),
    startSession: build.mutation<StartSessionResponse, string>({
      queryFn: async (accessToken) => {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
          // Экранируем токен для URL
          const encodedToken = encodeURIComponent(accessToken);
          const url = `${baseUrl}/public/session/${encodedToken}/start`;
          
          // eslint-disable-next-line no-console
          console.log('Starting session:', url);

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            const errorText = await response.text();
            // eslint-disable-next-line no-console
            console.error('Error starting session:', response.status, errorText);
            return {
              error: {
                status: response.status,
                data: errorText || `HTTP ${response.status}: ${response.statusText}`,
              },
            };
          }

          const data = await response.json();
          // eslint-disable-next-line no-console
          console.log('Start session response:', data);
          return { data: data as StartSessionResponse };
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Exception in startSession:', err);
          return {
            error: {
              status: 'FETCH_ERROR',
              data: err instanceof Error ? err.message : 'Unknown error',
            },
          };
        }
      },
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useCreateAccessLinkMutation,
  useGetSessionByTokenQuery,
  useStartSessionMutation,
} = sessionApi;
