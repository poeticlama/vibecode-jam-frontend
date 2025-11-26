import { baseApi } from '../baseApi';

type LoginRequest = { username: string; password: string };
type LoginResponse = string | { token: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<string, LoginRequest>({
      query: (body) => ({
        url: '/user/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: LoginResponse): string => {
        // Если бэк возвращает объект с токеном
        if (
          typeof response === 'object' &&
          response !== null &&
          'token' in response
        ) {
          return response.token;
        }

        // Если бэк возвращает просто строку токена
        if (typeof response === 'string') {
          return response;
        }

        throw new Error('Invalid login response format');
      },
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
