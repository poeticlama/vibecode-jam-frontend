import { useState } from 'react';

import TaskCard, { type Question } from '../../components/admin/TaskCard.tsx';

const EditExamPage = () => {
  const session = mock_session;
  const initialTasks = session.tests.map((test) => test.questions).flat();

  const [tasks, setTasks] = useState<Question[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Question | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
    
    // Ебать Курсорчик плотную такую жижу написал
    // Сюда, короче API сервис нужно втыкнуть

    console.log('Сохранение задач:', tasks);
    setHasChanges(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      {/* Главный контейнер Edit exam */}
      <div className="border-base-300 bg-base-100 relative w-full max-w-4xl rounded-lg border p-6 shadow-lg">
        {/* Заголовок */}
        <h1 className="text-primary mb-6 text-left text-2xl font-bold">
          Edit exam
        </h1>

        {/* Список задач */}
        <div className="mb-6 space-y-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-base-content/60 py-10 text-center">
              Нет задач для отображения
            </div>
          )}
        </div>

        {/* Кнопка сохранения внизу справа */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className={`btn btn-primary ${!hasChanges ? 'btn-disabled opacity-50' : ''}`}
          >
            save
          </button>
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
        <h2 className="text-base-content mb-4 text-xl font-bold">
          Редактирование задания
        </h2>

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

const mock_session = {
  sessionId: '8f5e631d-3d26-4da6-b234-5a2c0520db75',
  description: 'Собеседование на Junior Backend',
  createdAt: '2025-11-26T11:00:24.508893',
  tests: [
    {
      testId: 2,
      sessionId: '8f5e631d-3d26-4da6-b234-5a2c0520db75',
      topic: 'BACKEND',
      questionCount: 5,
      createdAt: '2025-11-26T11:02:19.357789',
      questions: [
        {
          id: 6,
          text: 'Какой из следующих вариантов НЕ является типом коллекции в Java?',
          optionA: 'ArrayList',
          optionB: 'LinkedList',
          optionC: 'HashSet',
          optionD: 'TreeMap',
          correctAnswer: 'd',
        },
        {
          id: 7,
          text: 'Что означает аббревиатура REST в контексте HTTP-сервисов?',
          optionA: 'Representational State Transfer',
          optionB: 'Resource State Transfer',
          optionC: 'Remote Service Technology',
          optionD: 'Resource State Transport',
          correctAnswer: 'a',
        },
        {
          id: 8,
          text: 'Какой аннотацией помечается класс в Spring, чтобы он автоматически создавался как бин?',
          optionA: '@Component',
          optionB: '@Service',
          optionC: '@Repository',
          optionD: '@Entity',
          correctAnswer: 'a',
        },
        {
          id: 9,
          text: 'Какой аннотацией помечается метод в Spring MVC, чтобы он обрабатывал GET-запросы?',
          optionA: '@GetMapping',
          optionB: '@PostMapping',
          optionC: '@PutMapping',
          optionD: '@DeleteMapping',
          correctAnswer: 'a',
        },
        {
          id: 10,
          text: 'Какой аннотацией в JPA помечается поле, чтобы оно стало первичным ключом с автоматической генерацией значений?',
          optionA: '@GeneratedValue',
          optionB: '@Id',
          optionC: '@Column',
          optionD: '@OneToOne',
          correctAnswer: 'a',
        },
      ],
    },
  ],
};

export default EditExamPage;
