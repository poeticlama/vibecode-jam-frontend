import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import CodeEditor from '../../components/candidate/CodeEditor.tsx';
import type { AlgorithmTask, Question } from '../../types/sessions.ts';
import {
  useCheckCodeMutation,
  useGetSessionByTokenQuery,
  useSendResultsMutation,
} from '../../store/api/endpoints/public.api.ts';

type TaskType = 'question' | 'algorithm';

type TaskItem = {
  type: TaskType;
  id: string | number;
  question?: Question;
  algorithmTask?: AlgorithmTask;
  index: number;
};

type Answer = {
  questionId?: number;
  taskId?: string;
  type: TaskType;
  answer: string;
  submittedAt: number;
};

const ExamPassingPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('candidateId');
    if (token) {
      const savedIndex = localStorage.getItem(`exam_current_index_${token}`);
      if (savedIndex !== null) {
        const index = parseInt(savedIndex, 10);
        if (!isNaN(index) && index >= 0) {
          return index;
        }
      }
    }
    return 0;
  });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [taskTimers, setTaskTimers] = useState<Record<string, number>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [checkCodeResults, setCheckCodeResults] = useState<Record<string, any>>({});
  const [currentLanguage, setCurrentLanguage] = useState('python');

  const candidateId = localStorage.getItem('candidateId');
  const accessToken = localStorage.getItem('accessToken') || candidateId;

  const {
    data: sessionData,
    isLoading,
    error,
  } = useGetSessionByTokenQuery(accessToken || '', {
    skip: !accessToken,
  });

  const [checkCode, { isLoading: isCheckingCode }] = useCheckCodeMutation();
  const [sendResults] = useSendResultsMutation();

  // Загрузка состояния из localStorage
  useEffect(() => {
    if (accessToken) {
      const savedAnswers = localStorage.getItem(`exam_answers_${accessToken}`);
      const savedTimers = localStorage.getItem(`exam_timers_${accessToken}`);
      const savedCurrentIndex = localStorage.getItem(`exam_current_index_${accessToken}`);
      const savedCurrentAnswer = localStorage.getItem(`exam_current_answer_${accessToken}`);
      const savedCheckResults = localStorage.getItem(`exam_check_results_${accessToken}`);
      
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedTimers) {
        setTaskTimers(JSON.parse(savedTimers));
      }
      if (savedCurrentIndex !== null) {
        const index = parseInt(savedCurrentIndex, 10);
        if (!isNaN(index)) {
          setCurrentTaskIndex(index);
        }
      }
      if (savedCurrentAnswer) {
        setCurrentAnswer(savedCurrentAnswer);
      }
      if (savedCheckResults) {
        setCheckCodeResults(JSON.parse(savedCheckResults));
      }
    }
  }, [accessToken]);

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

    const allTasks: TaskItem[] = [];
    let index = 0;

    // Добавляем вопросы
    sessionData.tests.forEach((test) => {
      test.questions.forEach((question) => {
        allTasks.push({
          type: 'question',
          id: question.id,
          question,
          index: index++,
        });
      });
    });

    // Добавляем алгоритмические задания
    sessionData.algorithmTasks.forEach((task) => {
      allTasks.push({
        type: 'algorithm',
        id: task.taskId,
        algorithmTask: task,
        index: index++,
      });
    });

    setTasks(allTasks);

    // Инициализация таймеров только для новых заданий
    setTaskTimers((prev) => {
      const initialTimers: Record<string, number> = {};
      allTasks.forEach((task) => {
        const taskKey = `${task.type}_${task.id}`;
        if (prev[taskKey] === undefined) {
          initialTimers[taskKey] = task.type === 'question' ? 60 : 600; // 1 минута или 10 минут
        }
      });
      return Object.keys(initialTimers).length > 0 ? { ...prev, ...initialTimers } : prev;
    });
  }, [sessionData]);

  // Сохранение ответов в localStorage
  useEffect(() => {
    if (accessToken && answers.length > 0) {
      localStorage.setItem(`exam_answers_${accessToken}`, JSON.stringify(answers));
    }
  }, [answers, accessToken]);

  // Сохранение текущего индекса и ответа в localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(`exam_current_index_${accessToken}`, currentTaskIndex.toString());
      localStorage.setItem(`exam_current_answer_${accessToken}`, currentAnswer);
    }
  }, [currentTaskIndex, currentAnswer, accessToken]);

  // Сохранение таймеров в localStorage
  useEffect(() => {
    if (accessToken && Object.keys(taskTimers).length > 0) {
      localStorage.setItem(`exam_timers_${accessToken}`, JSON.stringify(taskTimers));
    }
  }, [taskTimers, accessToken]);

  // Таймер для текущего задания
  useEffect(() => {
    if (isFinished || tasks.length === 0 || currentTaskIndex >= tasks.length) {
      return;
    }

    const currentTask = tasks[currentTaskIndex];
    const taskKey = `${currentTask.type}_${currentTask.id}`;
    const timeRemaining = taskTimers[taskKey];

    if (timeRemaining === undefined || timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTaskTimers((prev) => {
        const newTimers = { ...prev };
        if (newTimers[taskKey] > 0) {
          newTimers[taskKey] = newTimers[taskKey] - 1;
        }
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [taskTimers, isFinished, tasks, currentTaskIndex]);

  const handleSaveAnswer = useCallback((task: TaskItem) => {
    if (!currentAnswer.trim()) {
      return;
    }

    const newAnswer: Answer = {
      type: task.type,
      answer: currentAnswer,
      submittedAt: Date.now(),
    };

    if (task.type === 'question' && task.question) {
      newAnswer.questionId = task.question.id;
    } else if (task.type === 'algorithm' && task.algorithmTask) {
      newAnswer.taskId = task.algorithmTask.taskId;
    }

    setAnswers((prev) => {
      const filtered = prev.filter(
        (a) =>
          !(
            (a.type === 'question' && a.questionId === newAnswer.questionId) ||
            (a.type === 'algorithm' && a.taskId === newAnswer.taskId)
          ),
      );
      return [...filtered, newAnswer];
    });

    // Переход к следующему заданию
    setCurrentTaskIndex((prev) => {
      const nextIndex = prev + 1;
      if (tasks.length > 0 && nextIndex < tasks.length) {
        return nextIndex;
      } else {
        // Все задания выполнены
        setIsFinished(true);
        return prev;
      }
    });
    setCurrentAnswer('');
    // Не сбрасываем результаты проверки кода при переходе к следующему заданию
  }, [currentAnswer, tasks.length]);

  const handleCheckCode = async (task: AlgorithmTask, code: string, language: string) => {
    try {
      const languageMap: Record<string, 'PYTHON' | 'JAVA' | 'JS' | 'CPP'> = {
        python: 'PYTHON',
        java: 'JAVA',
        javascript: 'JS',
        cpp: 'CPP',
      };

      const result = await checkCode({
        taskId: task.taskId,
        language: languageMap[language] || 'PYTHON',
        source: code,
      }).unwrap();

      setCheckCodeResults((prev) => {
        const updated = {
          ...prev,
          [task.taskId]: result,
        };
        // Сохранение результатов проверки в localStorage
        if (accessToken) {
          localStorage.setItem(`exam_check_results_${accessToken}`, JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err) {
      console.error('Failed to check code:', err);
    }
  };

  // Обновление текущего ответа при смене задания
  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    // Если индекс выходит за границы, корректируем его
    if (currentTaskIndex >= tasks.length) {
      setCurrentTaskIndex(tasks.length - 1);
      return;
    }

    const currentTask = tasks[currentTaskIndex];
    const savedAnswer = answers.find(
      (a) =>
        (currentTask.type === 'question' && a.questionId === currentTask.id) ||
        (currentTask.type === 'algorithm' && a.taskId === currentTask.id),
    );

    if (savedAnswer) {
      setCurrentAnswer(savedAnswer.answer);
    } else {
      setCurrentAnswer('');
    }
    // Не сбрасываем результаты проверки кода, они нужны для финального расчета
  }, [currentTaskIndex, tasks, answers]);

  // Автоматическое сохранение при истечении времени
  useEffect(() => {
    if (tasks.length === 0 || currentTaskIndex >= tasks.length || isFinished) {
      return;
    }

    const currentTask = tasks[currentTaskIndex];
    const taskKey = `${currentTask.type}_${currentTask.id}`;
    const timeRemaining = taskTimers[taskKey];

    if (timeRemaining === 0 && currentAnswer.trim()) {
      handleSaveAnswer(currentTask);
    }
  }, [taskTimers, tasks, currentTaskIndex, currentAnswer, isFinished, handleSaveAnswer]);

  // Расчет результатов
  const calculateResults = useCallback(() => {
    if (!sessionData) {
      return { testPercentage: '0', algorithmPercentage: '0', violationDetected: 'false' };
    }

    // Расчет процента правильных ответов для вопросов
    let correctAnswers = 0;
    let totalQuestions = 0;

    sessionData.tests.forEach((test) => {
      test.questions.forEach((question) => {
        totalQuestions++;
        const userAnswer = answers.find((a) => a.questionId === question.id);
        if (userAnswer && userAnswer.answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctAnswers++;
        }
      });
    });

    const testPercentage = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100).toString()
      : '0';

    // Расчет процента пройденных тестов для алгоритмических заданий
    let passedTests = 0;
    let totalTests = 0;

    sessionData.algorithmTasks.forEach((task) => {
      const result = checkCodeResults[task.taskId];
      if (result && result.results && Array.isArray(result.results)) {
        result.results.forEach((testResult: any) => {
          totalTests++;
          if (testResult.status === 'PASSED' || testResult.status === 'passed') {
            passedTests++;
          }
        });
      }
    });

    const algorithmPercentage = totalTests > 0
      ? Math.round((passedTests / totalTests) * 100).toString()
      : '0';

    // Проверка на нарушения (можно добавить логику детекции)
    const violationDetected = 'false';

    return {
      testPercentage,
      algorithmPercentage,
      violationDetected,
    };
  }, [sessionData, answers, checkCodeResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Отправка результатов при завершении
  useEffect(() => {
    if (!isFinished || !sessionData || !accessToken) {
      return;
    }

    const results = calculateResults();
    
    sendResults({
      accessToken,
      testResults: results.testPercentage,
      algorithmResults: results.algorithmPercentage,
      violationDetected: results.violationDetected,
    }).catch((err) => {
      console.error('Failed to send results:', err);
    });
  }, [isFinished, sessionData, accessToken, calculateResults, sendResults]);

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
            <h2 className="text-error card-title justify-center text-2xl">Ошибка</h2>
            <p className="text-base-content/70">
              {'status' in (error as any)
                ? `Ошибка загрузки данных экзамена (${(error as any).status})`
                : 'Не удалось загрузить данные экзамена'}
            </p>
            <div className="card-actions mt-4 justify-center">
              <button
                onClick={() => navigate(`/startExam/${candidateId || accessToken}`)}
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
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0 || currentTaskIndex >= tasks.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const taskKey = `${currentTask.type}_${currentTask.id}`;
  const timeRemaining = taskTimers[taskKey] || 0;
  const checkResult = checkCodeResults[currentTask.id as string];

  return (
    <div className="bg-base-200 flex min-h-screen flex-col">
      {/* Шапка */}
      <div className="bg-base-100 border-b-base-300 sticky top-0 z-10 border-b p-4 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-primary text-xl font-bold">{sessionData.description}</h1>
            <p className="text-base-content/70 text-sm">
              Задание {currentTaskIndex + 1} из {tasks.length}
            </p>
          </div>
          {timeRemaining > 0 && (
            <div className="text-center">
              <div className="text-base-content/70 text-xs">Осталось времени</div>
              <div className="text-warning text-lg font-bold">
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}
          {timeRemaining === 0 && (
            <div className="badge badge-error">Время вышло</div>
          )}
        </div>
      </div>

      {/* Основной контент */}
      <div className="mx-auto w-full max-w-6xl flex-1 p-4">
        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
          {/* Заголовок задания */}
          <div className="mb-4">
            <h2 className="text-base-content text-xl font-semibold">
              {currentTask.type === 'question'
                ? `Вопрос ${currentTaskIndex + 1}`
                : `Алгоритмическое задание ${currentTaskIndex + 1}`}
            </h2>
          </div>

          {/* Вопрос */}
          {currentTask.type === 'question' && currentTask.question && (
            <div>
              <p className="text-base-content mb-4 text-lg">{currentTask.question.text}</p>
              <div className="space-y-3 mb-4">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const optionKey = `option${letter}` as keyof Question;
                  const optionValue = currentTask.question![optionKey] as string | undefined;

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
                        name={`answer_${taskKey}`}
                        value={letter.toLowerCase()}
                        checked={currentAnswer === letter.toLowerCase()}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        disabled={timeRemaining === 0}
                        className="radio radio-primary mr-3"
                      />
                      <span className="text-base-content">
                        <span className="font-semibold">{letter}.</span> {optionValue}
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={() => handleSaveAnswer(currentTask)}
                disabled={!currentAnswer || timeRemaining === 0}
                className="btn btn-primary"
              >
                Сохранить ответ и перейти дальше
              </button>
            </div>
          )}

          {/* Алгоритмическое задание */}
          {currentTask.type === 'algorithm' && currentTask.algorithmTask && (
            <div>
              <h3 className="text-base-content mb-2 text-lg font-semibold">
                {currentTask.algorithmTask.titleRu}
              </h3>
              <p className="text-base-content mb-4 whitespace-pre-wrap">
                {currentTask.algorithmTask.descriptionRu}
              </p>
              <div className="mb-4">
                <CodeEditor
                  initialCode={currentAnswer || '// Напишите ваш код здесь'}
                  language={currentLanguage}
                  onChange={(code) => setCurrentAnswer(code)}
                  height="400px"
                  readOnly={timeRemaining === 0}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveAnswer(currentTask)}
                  disabled={!currentAnswer.trim() || timeRemaining === 0}
                  className="btn btn-primary"
                >
                  Сохранить код и перейти дальше
                </button>
                      <button
                        onClick={() =>
                          handleCheckCode(
                            currentTask.algorithmTask!,
                            currentAnswer,
                            currentLanguage,
                          )
                        }
                        disabled={!currentAnswer.trim() || timeRemaining === 0 || isCheckingCode}
                        className="btn btn-secondary"
                      >
                        {isCheckingCode ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Проверка...
                          </>
                        ) : (
                          'Запустить тест'
                        )}
                      </button>
              </div>
              {checkResult && (
                <div className="mt-4 rounded-lg border border-base-300 p-4">
                  <h4 className="text-base-content mb-2 font-semibold">Результаты:</h4>
                  <div className="text-base-content text-sm">
                    <div>Статус: {checkResult.status}</div>
                    {checkResult.compileError && (
                      <div className="text-error mt-2">
                        Ошибка компиляции: {checkResult.compileError}
                      </div>
                    )}
                    {checkResult.runtimeError && (
                      <div className="text-error mt-2">
                        Ошибка выполнения: {checkResult.runtimeError}
                      </div>
                    )}
                    {checkResult.results && checkResult.results.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {checkResult.results.map((result: any, idx: number) => (
                          <div key={idx} className="text-xs">
                            Тест {result.testIndex + 1}: {result.status} - Ожидалось:{' '}
                            {result.expected}, Получено: {result.got}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPassingPage;
