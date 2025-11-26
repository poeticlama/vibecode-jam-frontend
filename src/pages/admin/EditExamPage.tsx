import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import TaskCard, { type Question } from '../../components/admin/TaskCard.tsx';
import type { Test } from '../../types/sessions.ts';

// Временно используем прямой запрос, пока не исправится экспорт хука
const useGetSession = (sessionId: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        // Исправляем: используем 'token' вместо 'authToken'
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/session/get/${sessionId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch session: ${response.status} ${response.statusText}. ${errorText}`
          );
        }

        const sessionData = await response.json();
        setData(sessionData);
        setError(null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching session:', err);
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return { data, isLoading, error };
};

const EditExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sessionData, isLoading, error } = useGetSession(id || '');

  const initialTasks = sessionData?.tests.flatMap((test: Test) => test.questions) || [];
  const [tasks, setTasks] = useState<Question[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Question | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Обновляем задачи при загрузке данных
  useEffect(() => {
    if (sessionData) {
      const newTasks = sessionData.tests.flatMap((test: Test) => test.questions);
      setTasks(newTasks);
    }
  }, [sessionData]);

  const handleEdit = (task: Question) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setHasChanges(true);
  };

  const handleSaveEdit = (updatedTask: Question) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditingTask(null);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    // TODO: отправить данные на сервер
    // eslint-disable-next-line no-console
    console.log('Сохранение задач:', tasks);
    setHasChanges(false);
    alert('Изменения сохранены!');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="bg-base-100 card w-full max-w-2xl shadow-xl">
          <div className="card-body text-center">
            <h2 className="text-error card-title justify-center text-2xl">Ошибка</h2>
            <p className="text-base-content/70">
              {error instanceof Error
                ? error.message
                : 'Не удалось загрузить данные экзамена'}
            </p>
            <div className="card-actions mt-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Обновить страницу
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8">
      {/* Заголовок и кнопка сохранения */}
      <div className="mb-6 flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-primary text-2xl font-bold">{sessionData.description}</h1>
        <button
          onClick={handleSaveAll}
          disabled={!hasChanges}
          className={`btn btn-primary ${!hasChanges ? 'btn-disabled opacity-50' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Сохранить изменения
        </button>
      </div>

      {/* Главный контейнер Edit exam */}
      <div className="border-base-300 bg-base-100 relative w-full max-w-4xl rounded-lg border p-6 shadow-lg">
        {/* Заголовок */}
        <h2 className="text-primary mb-6 text-left text-xl font-bold">Изменить задания</h2>

        {/* Список задач */}
        <div className="mb-6 space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="border-base-300 rounded-lg border p-8 text-center">
              <p className="text-base-content/60 mb-4 text-lg">
                В этом экзамене пока нет вопросов
              </p>
              <p className="text-base-content/50 text-sm">
                Создайте тест, чтобы добавить вопросы к экзамену
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно редактирования */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

type EditTaskModalProps = {
  task: Question;
  onSave: (task: Question) => void;
  onClose: () => void;
};

const EditTaskModal = ({ task, onSave, onClose }: EditTaskModalProps) => {
  const [formData, setFormData] = useState<Question>(task);

  const handleChange = (field: keyof Question, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 mx-4 w-full max-w-lg rounded-lg p-6 shadow-xl">
        <h2 className="text-base-content mb-4 text-xl font-bold">Редактирование задания</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Текст вопроса</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={3}
            />
          </div>

          {['A', 'B', 'C', 'D'].map((letter) => {
            const field = `option${letter}` as keyof Question;

            return (
              <div key={letter}>
                <label className="label">
                  <span className="label-text">Вариант {letter}</span>
                </label>
                <input
                  type="text"
                  value={formData[field] as string}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            );
          })}

          <div>
            <label className="label">
              <span className="label-text">Правильный ответ</span>
            </label>
            <select
              value={formData.correctAnswer}
              onChange={(e) => handleChange('correctAnswer', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamPage;
