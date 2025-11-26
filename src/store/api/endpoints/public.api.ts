import { baseApi } from '../baseApi.ts';
import type { Session } from '../../../types/sessions.ts';

type StartSessionResponse = {
  alreadyStarted: boolean;
  message: string;
};

type CheckCodeRequest = {
  taskId: string;
  language: "PYTHON" | "JAVA" | "JS" | "CPP";
  source: string;
};

type CheckCodeResponse = {
  status: string;
  compileError: string;
  runtimeError: string;
  results: CodingTestResult[];
};

type CodingTestResult = {
  testIndex: number;
  status: string;
  expected: string;
  got: string;
  stderr: string;
};

type SendResultsRequest = {
  accessToken: string;
  testResults: string;
  algorithmResults: string;
  violationDetected: string;
}

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
    checkCode: build.mutation<CheckCodeResponse, CheckCodeRequest>({
      query: (body) => ({
        url: 'code/submit',
        method: 'POST',
        body,
      })
    }),
    sendResults: build.mutation<void, SendResultsRequest>({
      query: ({accessToken, ...body}) => ({
        url: `public/session/${accessToken}/results`,
        headers: {
          'X-System-Token': 'qwerty',
        },
        method: 'POST',
        body,
      })
    })
  }),
});

export const { useGetSessionByTokenQuery, useStartSessionMutation, useCheckCodeMutation, useSendResultsMutation } = publicApi;
