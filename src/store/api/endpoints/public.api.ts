import { baseApi } from '../baseApi.ts';
import type { Session } from '../../../types/sessions.ts';

type StartSessionResponse = {
  alreadyStarted: boolean;
  message: string;
};

const publicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSessionByToken: build.query<Session, string>({
      query: (accessToken) => ({
        url: `public/session/${accessToken}`,
        headers: {
          'X-System-Token': 'qwerty',
        },
      }),
    }),
    startSession: build.mutation<StartSessionResponse, string>({
      query: (accessToken) => ({
        url: `public/session/${accessToken}/start`,
        method: 'POST',
      })
    }),
  }),
});

export const { useGetSessionByTokenQuery, useStartSessionMutation } = publicApi;
