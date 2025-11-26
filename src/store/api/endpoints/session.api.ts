import type { Session } from '../../../types/sessions.ts';
import { baseApi } from '../baseApi.ts';

type CreateSessionRequest = {
  description: string;
};

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
  }),
});

export const { useCreateSessionMutation, useGetAllSessionsQuery } = sessionApi;
