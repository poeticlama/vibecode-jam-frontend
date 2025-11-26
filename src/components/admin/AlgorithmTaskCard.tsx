import type { AlgorithmTask } from '../../types/sessions.ts';

type AlgorithmTaskCardProps = {
  task: AlgorithmTask;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
    case 'легкая':
      return 'badge-success';
    case 'medium':
    case 'средняя':
      return 'badge-warning';
    case 'hard':
    case 'сложная':
      return 'badge-error';
    default:
      return 'badge-neutral';
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'Легкая';
    case 'medium':
      return 'Средняя';
    case 'hard':
      return 'Сложная';
    default:
      return difficulty;
  }
};

const AlgorithmTaskCard = ({ task }: AlgorithmTaskCardProps) => {
  return (
    <div className="border-base-300 bg-base-100 mb-4 w-full rounded-lg border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base-content text-xl font-bold">{task.titleRu}</h3>
        <div className={`badge ${getDifficultyColor(task.difficulty)} badge-lg`}>
          {getDifficultyText(task.difficulty)}
        </div>
      </div>
      
      <div className="text-base-content/70 mb-4 text-sm">
        Назначено: {new Date(task.assignedAt).toLocaleDateString('ru-RU')}
      </div>

      {task.descriptionRu && (
        <div className="mb-4">
          <h4 className="text-base-content mb-2 text-sm font-semibold">Условие:</h4>
          <div className="text-base-content whitespace-pre-wrap rounded-lg bg-base-200 p-4 text-sm">
            {task.descriptionRu}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmTaskCard;

