import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import CodeEditor from '../../components/candidate/CodeEditor.tsx';
import type { Question } from '../../types/sessions.ts';
import {useGetSessionByTokenQuery} from "../../store/api/endpoints/public.api.ts";

type Answer = {
  questionId: number;
  answer: string;
  submittedAt: number;
};

const ExamPassingPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 час по умолчанию
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<
    number | null
  >(300); // 5 минут на вопрос
  const [isFinished, setIsFinished] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentCode, setCurrentCode] = useState('');

  const candidateId = localStorage.getItem('candidateId');
  const accessToken = localStorage.getItem('accessToken') || candidateId;

  const {
    data: sessionData,
    isLoading,
    error,
  } = useGetSessionByTokenQuery(accessToken || '', {
    skip: !accessToken,
  });

  // Проверка, начат ли экзамен
  useEffect(() => {
    if (!candidateId && !accessToken) {
      navigate('/startExam/unknown');
      return;
    }

    const examStarted = localStorage.getItem(
      `exam_started_${candidateId || accessToken}`,
    );
    if (examStarted !== 'true') {
      navigate(`/startExam/${candidateId || accessToken}`);
    }
  }, [candidateId, accessToken, navigate]);

  // Подготовка данных экзамена
  useEffect(() => {
    if (!sessionData) {
      return;
    }

    // Подсчитываем общее количество вопросов
    const totalQuestions = sessionData.tests.reduce(
      (sum, test) => sum + test.questionCount,
      0,
    );
    // Устанавливаем общее время (например, 2 минуты на вопрос)
    setTimeRemaining(totalQuestions * 120);
  }, [sessionData]);

  const handleFinishExam = useCallback(() => {
    if (isFinished) {
      return;
    }

    setIsFinished(true);

    // Если последний вопрос не был отправлен, отправляем его
    if (sessionData) {
      const allQuestions = sessionData.tests.flatMap((test) => test.questions);
      if (currentQuestionIndex < allQuestions.length - 1) {
        const currentQuestion = allQuestions[currentQuestionIndex];
        if (currentQuestion) {
          const answer: Answer = {
            questionId: currentQuestion.id,
            answer: currentAnswer || currentCode,
            submittedAt: Date.now(),
          };
          setAnswers((prev) => {
            const finalAnswers = [...prev, answer];
            // TODO: Отправка результатов на сервер
            // eslint-disable-next-line no-console
            console.log('Результаты экзамена:', {
              candidateId,
              answers: finalAnswers,
              finishedAt: Date.now(),
            });
            return finalAnswers;
          });
          return;
        }
      }
    }

    // TODO: Отправка результатов на сервер
    setAnswers((prev) => {
      // eslint-disable-next-line no-console
      console.log('Результаты экзамена:', {
        candidateId,
        answers: prev,
        finishedAt: Date.now(),
      });
      return prev;
    });
  }, [
    isFinished,
    sessionData,
    currentQuestionIndex,
    currentAnswer,
    currentCode,
    candidateId,
  ]);

  const handleSubmitAnswer = useCallback(() => {
    if (!sessionData) {
      return;
    }

    const allQuestions = sessionData.tests.flatMap((test) => test.questions);
    const currentQuestion = allQuestions[currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    const answer: Answer = {
      questionId: currentQuestion.id,
      answer: currentAnswer || currentCode,
      submittedAt: Date.now(),
    };

    setAnswers((prev) => [...prev, answer]);

    // Переход к следующему вопросу
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setCurrentCode('');
      setQuestionTimeRemaining(300); // Сброс таймера вопроса
    } else {
      // Все вопросы отвечены
      handleFinishExam();
    }
  }, [
    sessionData,
    currentQuestionIndex,
    currentAnswer,
    currentCode,
    handleFinishExam,
  ]);

  // Общий таймер экзамена
  useEffect(() => {
    if (!sessionData || isFinished) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData, isFinished, handleFinishExam]);

  // Таймер для текущего вопроса
  useEffect(() => {
    if (!sessionData || questionTimeRemaining === null || isFinished) {
      return;
    }

    const interval = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitAnswer();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData, questionTimeRemaining, isFinished, handleSubmitAnswer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="bg-base-200 flex min-h-screen items-center justify-center px-4">
        <div className="bg-base-100 card w-full max-w-2xl shadow-xl">
          <div className="card-body text-center">
            <h2 className="text-error card-title justify-center text-2xl">
              Ошибка
            </h2>
            <p className="text-base-content/70">
              {'status' in (error as any)
                ? `Ошибка загрузки данных экзамена (${(error as any).status})`
                : 'Не удалось загрузить данные экзамена'}
            </p>
            <div className="card-actions mt-4 justify-center">
              <button
                onClick={() =>
                  navigate(`/startExam/${candidateId || accessToken}`)
                }
                className="btn btn-primary"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Финишный стейт
  if (isFinished) {
    return (
      <div className="bg-base-200 flex min-h-screen items-center justify-center px-4">
        <div className="bg-base-100 card w-full max-w-2xl shadow-xl">
          <div className="card-body text-center">
            <h2 className="text-success card-title justify-center text-2xl">
              Экзамен завершен!
            </h2>
            <p className="text-base-content/70">
              Спасибо за прохождение экзамена. Ваши ответы были сохранены.
            </p>
            <div className="card-actions mt-4 justify-center">
              <button
                onClick={() => {
                  localStorage.removeItem(
                    `exam_started_${candidateId || accessToken}`,
                  );
                  localStorage.removeItem('exam_start_time');
                  navigate('/');
                }}
                className="btn btn-primary"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Получаем все вопросы из всех тестов
  const allQuestions = sessionData.tests.flatMap((test) => test.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="bg-base-200 flex min-h-screen flex-col">
      {/* Шапка с таймерами */}
      <div className="bg-base-100 border-b-base-300 sticky top-0 z-10 border-b p-4 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-primary text-xl font-bold">
              {sessionData.description}
            </h1>
            <p className="text-base-content/70 text-sm">
              Вопрос {currentQuestionIndex + 1} из {allQuestions.length}
            </p>
          </div>
          <div className="flex gap-4">
            {questionTimeRemaining !== null && (
              <div className="text-center">
                <div className="text-base-content/70 text-xs">
                  Время на вопрос
                </div>
                <div className="text-warning text-lg font-bold">
                  {formatTime(questionTimeRemaining)}
                </div>
              </div>
            )}
            <div className="text-center">
              <div className="text-base-content/70 text-xs">Общее время</div>
              <div className="text-primary text-lg font-bold">
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="mx-auto w-full max-w-6xl flex-1 p-4">
        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
          {/* Текст вопроса */}
          <div className="mb-6">
            <h2 className="text-base-content mb-4 text-2xl font-semibold">
              {currentQuestion.text}
            </h2>

            {/* Multiple choice вопрос */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((letter) => {
                const optionKey = `option${letter}` as keyof Question;
                const optionValue = currentQuestion[optionKey] as
                  | string
                  | undefined;

                if (!optionValue) {
                  return null;
                }

                return (
                  <label
                    key={letter}
                    className={`border-base-300 flex cursor-pointer items-center rounded-lg border p-4 transition-all ${
                      currentAnswer === letter.toLowerCase()
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={letter.toLowerCase()}
                      checked={currentAnswer === letter.toLowerCase()}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      className="radio radio-primary mr-3"
                    />
                    <span className="text-base-content">
                      <span className="font-semibold">{letter}.</span>{' '}
                      {optionValue}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Кнопки навигации */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((prev) => prev - 1);
                  setCurrentAnswer('');
                  setCurrentCode('');
                  setQuestionTimeRemaining(300);
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="btn btn-ghost"
            >
              ← Предыдущий вопрос
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer}
              className="btn btn-primary"
            >
              {currentQuestionIndex === allQuestions.length - 1
                ? 'Завершить экзамен'
                : 'Следующий вопрос →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPassingPage;
