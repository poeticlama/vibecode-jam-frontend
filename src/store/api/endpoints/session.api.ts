import type {Session, Topic, Test, AlgorithmTask, CandidateType, CandidateResult} from '../../../types/sessions.ts';
import { baseApi } from '../baseApi.ts';

type CreateSessionRequest = {
  description: string;
};

type CreateTestRequest = {
  topic: string;
  sessionId: string;
}

type CreateParticipantRequest = {
  sessionId: string;
  candidateName: string;
}

type CreateParticipantResponse = {
  accessToken: string;
  accessUrl: string;
  candidateName: string;
}

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
    getTopics: build.query<Topic[], void>({
      query: () => ({
        url: '/session/topics',
        method: 'GET',
      }),
    }),
    getSession: build.query<Session, string>({
      query: (sessionId) => ({
        url: `session/get/${sessionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, sessionId) => [{ type: 'Session', id: sessionId }],
    }),
    createTest: build.mutation<Test, CreateTestRequest>({
      query: ({ topic, sessionId }) => ({
        url: `session/createTest?topic=${topic}&questionCount=5&sessionId=${sessionId}`,
        method: 'GET',
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: 'Session', id: sessionId },
        'Session',
      ],
    }),
    createRandomAlgorithmTask: build.mutation<AlgorithmTask, string>({
      query: (sessionId) => ({
        url: `session/randomTask?sessionId=${sessionId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, sessionId) => [
        { type: 'Session', id: sessionId },
        'Session',
      ],
    }),
    createParticipant: build.mutation<CreateParticipantResponse, CreateParticipantRequest>({
      query: (body) => ({
        url: 'session/createAccessLink',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: 'Session', id: sessionId },
        'Session',
      ],
    }),
    getCandidatesUrls: build.query<CandidateType[], string>({
      query: (sessionId) => ({
        url: `session/candidates/${sessionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, sessionId) => [
        { type: 'Session', id: sessionId },
        'Session',
      ],
    }),
    getCandidatesResults: build.query<CandidateResult[], string>({
      query: (sessionId) => ({
        url: `session/results/${sessionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, sessionId) => [
        { type: 'Session', id: sessionId },
        'Session',
      ],
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
  useGetTopicsQuery,
  useGetSessionQuery,
  useCreateTestMutation,
  useCreateRandomAlgorithmTaskMutation,
  useCreateParticipantMutation,
  useGetCandidatesUrlsQuery,
  useGetCandidatesResultsQuery,
} = sessionApi;