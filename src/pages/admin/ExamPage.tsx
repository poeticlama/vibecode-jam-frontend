import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router';
// import { Link } from 'react-router';

import CandidatesResults from '../../components/admin/CandidatesResultsCard.tsx';
import {
  useCreateParticipantMutation,
  useGetAllSessionsQuery,
  useGetCandidatesResultsQuery,
  useGetCandidatesUrlsQuery,
} from '../../store/api/endpoints/session.api.ts';

const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const [candidateName, setCandidateName] = useState('');
  const { data: sessions, isLoading } = useGetAllSessionsQuery();
  const session = sessions?.find((s) => s.sessionId === id);
  const { data: candidatesUrls, isLoading: isLoadingUrls } =
    useGetCandidatesUrlsQuery(id || '', { skip: !id });
  const { data: candidatesResults, isLoading: isLoadingResults } =
    useGetCandidatesResultsQuery(id || '', { skip: !id });
  const [createParticipant, { isLoading: isCreatingParticipant }] =
    useCreateParticipantMutation();

  const handleCreateParticipant = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !candidateName.trim()) return;

    try {
      await createParticipant({ sessionId: id, candidateName }).unwrap();
      setCandidateName('');
    } catch (err) {
      console.error('Failed to create participant:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-neutral text-lg">Сессия не найдена</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-3 py-10 md:px-10 lg:px-20">
      <h1 className="text-primary mb-10 text-3xl font-bold">
        {session.description}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          {/*<Link*/}
          {/*  className="btn btn-primary w-fit"*/}
          {/*  to={`/admin/edit/${session.sessionId}`}*/}
          {/*>*/}
          {/*  Редактировать задания*/}
          {/*</Link>*/}
          {/*<button className="btn btn-error w-fit">*/}
          {/*  Сбросить списки участников*/}
          {/*</button>*/}
        </div>

        {/* Добавление участника */}
        <div className="mb-4">
          <h2 className="mb-3 text-lg font-semibold">Добавить участника:</h2>
          <form onSubmit={handleCreateParticipant} className="flex gap-3">
            <input
              type="text"
              className="input input-bordered flex-1 max-w-md"
              placeholder="Введите имя участника"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
              disabled={isCreatingParticipant || !id}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreatingParticipant || !id || !candidateName.trim()}
            >
              {isCreatingParticipant ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Добавление...
                </>
              ) : (
                'Добавить'
              )}
            </button>
          </form>
        </div>

        {/* Ссылки кандидатов */}
        {candidatesUrls && candidatesUrls.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-3 text-lg font-semibold">
              Ссылки кандидатов ({candidatesUrls.length}):
            </h2>
            <div className="space-y-2">
              {candidatesUrls.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border-base-300 bg-base-100 flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex flex-col">
                    <span className="text-base-content font-medium">
                      {candidate.candidateName}
                    </span>
                    <span className="text-base-content/70 text-sm">
                      Создано: {new Date(candidate.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      readOnly
                      value={candidate.accessUrl}
                      className="input input-bordered input-sm w-96"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(candidate.accessUrl);
                      }}
                    >
                      Копировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoadingUrls && (
          <div className="flex items-center justify-center py-4">
            <span className="loading loading-spinner"></span>
          </div>
        )}

        {/* Результаты кандидатов */}
        {candidatesResults && candidatesResults.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-3 text-lg font-semibold">
              Результаты кандидатов ({candidatesResults.length}):
            </h2>
            <div className="space-y-4">
              {candidatesResults.map((result) => (
                <CandidatesResults key={result.id} result={result} />
              ))}
            </div>
          </div>
        )}

        {isLoadingResults && (
          <div className="flex items-center justify-center py-4">
            <span className="loading loading-spinner"></span>
          </div>
        )}

        {(!candidatesUrls || candidatesUrls.length === 0) &&
          (!candidatesResults || candidatesResults.length === 0) &&
          !isLoadingUrls &&
          !isLoadingResults && (
            <div className="text-base-content/60 py-10 text-center">
              Пока нет участников или результатов
            </div>
          )}
      </div>
    </div>
  );
};

export default ExamPage;
