import { useParams } from 'react-router';

import AlgorithmTaskCard from '../../components/admin/AlgorithmTaskCard.tsx';
import TestCard from '../../components/admin/TestCard.tsx';
import {
  useCreateRandomAlgorithmTaskMutation,
  useCreateTestMutation,
  useGetSessionQuery,
  useGetTopicsQuery,
} from '../../store/api/endpoints/session.api.ts';

const ExamFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();
  const {
    data: session,
    isError: sessionError,
    isLoading: sessionLoading,
  } = useGetSessionQuery(id || '');
  const [createTest, { isLoading: isCreatingTest }] = useCreateTestMutation();
  const [createRandomAlgorithmTask, { isLoading: isCreatingAlgorithmTask }] =
    useCreateRandomAlgorithmTaskMutation();

  const handleTopicClick = async (topicName: string) => {
    if (!id) return;

    try {
      await createTest({ topic: topicName, sessionId: id }).unwrap();
    } catch (err) {
      console.error('Failed to create test:', err);
    }
  };

  const handleCreateAlgorithmTask = async () => {
    if (!id) return;

    try {
      await createRandomAlgorithmTask(id).unwrap();
    } catch (err) {
      console.error('Failed to create algorithm task:', err);
    }
  };

  if (topicsLoading || sessionLoading) {
    return (
      <div className="text-error flex h-100 w-full items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="text-error flex h-100 w-full items-center justify-center">
        Произошла ошибка, неверный адрес
      </div>
    );
  }

  return (
    <div className="h-full w-full px-3 py-10 md:px-10 lg:px-20">
      <h1 className="text-primary mb-10 text-3xl font-bold">
        Создание тестового задания: {session?.description}
      </h1>

      {/* Добавление вопросов по темам */}
      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">
          Добавить вопросы по темам:
        </h2>
        {isCreatingTest ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-dots loading-xl"></span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {topics ? (
              topics.map((topic) => (
                <button
                  key={topic.name}
                  className="btn btn-primary"
                  onClick={() => handleTopicClick(topic.name)}
                  disabled={!id}
                >
                  {topic.displayName}
                </button>
              ))
            ) : (
              <span className="loading loading-spinner loading-xl"></span>
            )}
          </div>
        )}
      </div>

      {/* Добавление алгоритмического задания */}
      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">
          Добавить алгоритмическое задание:
        </h2>
        {isCreatingAlgorithmTask ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-dots loading-xl"></span>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleCreateAlgorithmTask}
            disabled={!id}
          >
            Создать случайное алгоритмическое задание
          </button>
        )}
      </div>

      {/* Тестовые задания */}
      {session?.tests && session.tests.length > 0 && (
        <div className="mb-10">
          <div className="collapse-plus bg-base-200 collapse">
            <input type="checkbox" />
            <div className="collapse-title text-primary text-xl font-bold">
              Тестовые задания ({session.tests.length})
            </div>
            <div className="collapse-content">
              <div className="space-y-4 pt-4">
                {session.tests.map((test) => (
                  <TestCard key={test.testId} test={test} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Алгоритмические задания */}
      {session?.algorithmTasks && session.algorithmTasks.length > 0 && (
        <div className="mb-10">
          <div className="collapse-plus bg-base-200 collapse">
            <input type="checkbox" />
            <div className="collapse-title text-primary text-xl font-bold">
              Алгоритмические задания ({session.algorithmTasks.length})
            </div>
            <div className="collapse-content">
              <div className="space-y-4 pt-4">
                {session.algorithmTasks.map((task) => (
                  <AlgorithmTaskCard key={task.taskId} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Сообщение, если нет заданий */}
      {(!session?.tests || session.tests.length === 0) &&
        (!session?.algorithmTasks || session.algorithmTasks.length === 0) && (
          <div className="text-base-content/60 py-10 text-center">
            Пока нет добавленных заданий. Выберите тему выше, чтобы добавить
            вопросы.
          </div>
        )}
    </div>
  );
};

export default ExamFormPage;
