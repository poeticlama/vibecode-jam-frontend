import { useState } from 'react';
import { Link } from 'react-router';

import { useCreateAccessLinkMutation } from '../../store/api/endpoints/session.api.ts';

type ExamCardProps = {
  cardTitle: string;
  id: string;
  className: string;
};

const ExamCard = ({ cardTitle, id, className }: ExamCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [createdLink, setCreatedLink] = useState<{
    accessToken: string;
    accessUrl: string;
    candidateName: string;
  } | null>(null);
  const [createAccessLink, { isLoading }] = useCreateAccessLinkMutation();

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateName.trim()) {
      return;
    }

    try {
      const result = await createAccessLink({
        sessionId: id,
        candidateName: candidateName.trim(),
      }).unwrap();

      setCreatedLink(result);
      setCandidateName('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Ошибка создания ссылки доступа:', err);
      alert('Ошибка создания ссылки доступа');
    }
  };

  const handleCopyLink = () => {
    if (createdLink?.accessUrl) {
      navigator.clipboard.writeText(createdLink.accessUrl);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCreatedLink(null);
    setCandidateName('');
  };

  return (
    <>
      <div
        className={'card bg-neutral-content card-xl shadow-sm' + className}
        key={id}
      >
        <div className="card-body flex flex-col justify-between">
          <h2 className="card-title text-neutral">{cardTitle}</h2>
          <div className="card-actions flex-col gap-2">
            <Link className="btn btn-primary btn-sm w-full" to={`/admin/exam/${id}`}>
              Перейти к экзамену
            </Link>
            <button
              className="btn btn-secondary btn-sm w-full"
              onClick={() => setShowModal(true)}
            >
              Создать ссылку доступа
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно создания ссылки */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-base-100 mx-4 w-full max-w-lg rounded-lg p-6 shadow-xl">
            <h2 className="text-base-content mb-4 text-xl font-bold">
              Создать ссылку доступа
            </h2>

            {createdLink ? (
              <div className="space-y-4">
                <div className="alert alert-success">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Ссылка доступа успешно создана!</span>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Кандидат:</span>
                  </label>
                  <p className="text-base-content">{createdLink.candidateName}</p>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Access Token:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={createdLink.accessToken}
                      readOnly
                      className="input input-bordered flex-1 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdLink.accessToken);
                        alert('Token скопирован!');
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      Копировать
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Ссылка доступа:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={createdLink.accessUrl}
                      readOnly
                      className="input input-bordered flex-1 font-mono text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="btn btn-ghost btn-sm"
                    >
                      Копировать
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={handleCloseModal} className="btn btn-primary">
                    Закрыть
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateLink} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Имя кандидата</span>
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Введите имя кандидата"
                    className="input input-bordered w-full"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-ghost"
                    disabled={isLoading}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !candidateName.trim()}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Создание...
                      </>
                    ) : (
                      'Создать ссылку'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExamCard;
