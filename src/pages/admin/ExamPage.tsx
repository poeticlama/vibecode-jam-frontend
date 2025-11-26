import { useParams } from 'react-router';
import { Link } from 'react-router';

import CandidatesResults from '../../components/admin/CandidatesResultsCard.tsx';
import { useGetAllSessionsQuery } from '../../store/api/endpoints/session.api.ts';

const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sessions, isLoading } = useGetAllSessionsQuery();
  const session = sessions?.find((s) => s.sessionId === id);

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3">
          <Link
            className="btn btn-primary w-fit"
            to={`/admin/edit/${session.sessionId}`}
          >
            Редактировать задания
          </Link>
          <button className="btn btn-error w-fit">
            Сбросить списки участников
          </button>
        </div>
        <div className="flex w-full flex-col items-center gap-5">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <CandidatesResults key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
