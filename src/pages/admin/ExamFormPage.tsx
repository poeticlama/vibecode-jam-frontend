import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useCreateSessionMutation } from '../../store/api/endpoints/session.api.ts';

const ExamFormPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [createSession, { isLoading, error }] = useCreateSessionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    try {
      const session = await createSession({ description }).unwrap();
      // Перенаправляем на страницу редактирования созданной сессии
      navigate(`/admin/edit/${session.sessionId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Ошибка создания экзамена:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-8">
      <div className="bg-base-100 card w-full max-w-2xl shadow-xl">
        <div className="card-body">
          <h1 className="text-primary card-title mb-4 text-3xl">Создать экзамен</h1>

          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {'data' in error
                  ? (error.data as { message?: string })?.message || 'Ошибка создания экзамена'
                  : 'Ошибка создания экзамена'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Название экзамена</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например: Экзамен по JavaScript для Middle Frontend разработчика"
                className="input input-bordered w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div className="card-actions mt-6 justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading || !description.trim()}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Создание...
                  </>
                ) : (
                  'Создать экзамен'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExamFormPage;
