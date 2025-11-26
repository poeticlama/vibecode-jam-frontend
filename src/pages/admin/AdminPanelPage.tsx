import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import ExamCard from '../../components/admin/ExamCard.tsx';
import {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
} from '../../store/api/endpoints/session.api.ts';

const AdminPanelPage = () => {
  const [examName, setExamName] = useState('');
  const [createSession, { isLoading, error }] = useCreateSessionMutation();
  const { data: sessions, isLoading: isLoadingSessions } =
    useGetAllSessionsQuery();
  const navigate = useNavigate();

  const examCards =
    sessions?.map((session) => (
      <ExamCard
        key={session.sessionId}
        cardTitle={session.description}
        id={session.sessionId}
        className="carousel-item mx-3 w-80 flex-shrink-0"
      />
    )) || [];

  const handleSessionCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!examName.trim()) {
      return;
    }

    try {
      const session = await createSession({ description: examName }).unwrap();
      navigate(`/admin/edit/${session.sessionId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create session:', err);
    }
  };

  return (
    <div className="h-full w-full px-3 py-10 md:px-10 lg:px-20">
      <h1 className="text-primary text-3xl font-bold">Панель администратора</h1>
      <form onSubmit={handleSessionCreate} className="mt-15 mb-10 ml-4">
        <div className="flex items-end gap-4">
          <div className="max-w-md flex-1">
            <label className="label">
              <span className="label-text">Название тестового задания</span>
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Введите название тестового задания"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && (
              <div className="mt-2 text-sm text-red-500">
                {'data' in error
                  ? (error.data as { message?: string })?.message ||
                    'Ошибка создания сессии'
                  : 'Ошибка создания сессии'}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !examName.trim()}
          >
            {isLoading ? 'Создание...' : '+ Создать тестовое задание'}
          </button>
        </div>
      </form>
      <div className="carousel bg-base-200 w-full rounded-xl py-10">
        {isLoadingSessions ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        ) : examCards.length > 0 ? (
          examCards
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-neutral text-lg">
              Нет созданных тестовых заданий
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
