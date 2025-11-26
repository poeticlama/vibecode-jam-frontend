import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {useStartSessionMutation} from "../../store/api/endpoints/public.api.ts";

const StartExamPage = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [isStarted, setIsStarted] = useState(false);
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    // Сохраняем accessToken в localStorage
    localStorage.setItem('accessToken', candidateId);
    localStorage.setItem('candidateId', candidateId);

    // Проверяем, был ли экзамен уже начат
    const examStarted = localStorage.getItem(`exam_started_${candidateId}`);
    if (examStarted === 'true') {
      setIsStarted(true);
    }
  }, [candidateId]);

  const handleStartExam = async () => {
    if (!candidateId) {
      return;
    }

    try {
      const response = await startSession(candidateId).unwrap();

      if (response.alreadyStarted) {
        // Сессия уже начата, просто переходим
        setIsStarted(true);
        return;
      }

      // Сохраняем флаг начала экзамена
      localStorage.setItem(`exam_started_${candidateId}`, 'true');
      localStorage.setItem('exam_start_time', Date.now().toString());

      // Переход на страницу экзамена
      window.location.href = '/exam';
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Ошибка начала экзамена:', err);
      alert(
        `Ошибка начала экзамена: ${
          err?.data || err?.message || 'Неизвестная ошибка'
        }`,
      );
    }
  };

  if (isStarted) {
    return (
      <div className="bg-base-200 flex min-h-screen items-center justify-center px-4">
        <div className="bg-base-100 card w-full max-w-2xl shadow-xl">
          <div className="card-body">
            <h2 className="text-primary card-title text-2xl">
              Экзамен уже начат
            </h2>
            <p className="text-base-content/70">
              Вы уже начали прохождение экзамена. Продолжите на странице
              экзамена.
            </p>
            <div className="card-actions mt-4">
              <Link to="/exam" className="btn btn-primary">
                Продолжить экзамен
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-8">
      <div className="bg-base-100 card w-full max-w-3xl shadow-xl">
        <div className="card-body">
          <h1 className="text-primary card-title mb-6 text-3xl">
            Информация об экзамене
          </h1>

          <div className="space-y-4">
            <div className="border-base-300 rounded-lg border p-4">
              <h3 className="text-base-content mb-3 font-semibold">
                Правила экзамена
              </h3>
              <ul className="text-base-content/70 list-inside list-disc space-y-2">
                <li>Нельзя переключать вкладки браузера</li>
                <li>
                  Нельзя выходить из браузера или открывать другие приложения
                </li>
                <li>Нельзя использовать консоль разработчика (F12)</li>
                <li>Запрещено копирование и вставка текста</li>
                <li>Запрещено открытие контекстного меню (правый клик)</li>
                <li>
                  При обнаружении нарушений экзамен будет автоматически завершен
                </li>
                <li>Время на каждый вопрос ограничено</li>
                <li>Ответы отправляются автоматически при истечении времени</li>
              </ul>
            </div>

            {/* Предупреждение */}
            <div className="alert alert-warning">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Внимание! После начала экзамена вы не сможете вернуться на эту
                страницу. Убедитесь, что готовы начать.
              </span>
            </div>
          </div>

          {/* Кнопка начала экзамена */}
          <div className="card-actions mt-6 justify-end">
            <button
              onClick={handleStartExam}
              className="btn btn-primary btn-lg"
              disabled={isStarting}
            >
              {isStarting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Запуск...
                </>
              ) : (
                'Начать экзамен'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExamPage;
