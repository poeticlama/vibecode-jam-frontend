export type Question = {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

type TaskCardProps = {
  task: Question;
  index: number;
  showCorrectAnswer?: boolean;
  onEdit?: (task: Question) => void;
  onDelete?: (taskId: number) => void;
};

const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  const options = [
    { key: 'a', label: 'A', text: task.optionA },
    { key: 'b', label: 'B', text: task.optionB },
    { key: 'c', label: 'C', text: task.optionC },
    { key: 'd', label: 'D', text: task.optionD },
  ];

  return (
    <div className="border-base-300 bg-base-100 mb-4 w-full rounded-lg border p-4">
      {/* Заголовок задания */}
      <div className="mb-3">
        <h3 className="text-base-content text-center text-lg font-semibold">
          Задание {index + 1}
        </h3>
      </div>

      {/* Текст вопроса */}
      <div className="mb-4">
        <p className="text-base-content text-sm leading-relaxed">{task.text}</p>
      </div>

      {/* Варианты ответов */}
      <div className="mb-4 space-y-2">
        {options.map((option) => (
          <div
            key={option.key}
            className={`flex items-center rounded-lg border p-2 text-sm ${
              option.key === task.correctAnswer
                ? 'border-success bg-success/10'
                : 'border-base-300 bg-base-200'
            }`}
          >
            <div
              className={`mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                option.key === task.correctAnswer
                  ? 'bg-success text-success-content'
                  : 'bg-neutral text-neutral-content'
              }`}
            >
              {option.label}
            </div>
            <span className="text-base-content flex-1">{option.text}</span>
          </div>
        ))}
      </div>

      {/* Кнопки действий */}
      {(onEdit || onDelete) && (
        <div className="flex justify-center gap-3">
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-outline btn-sm border-error text-error hover:bg-error hover:text-error-content"
              title="Удалить"
            >
              Удалить
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="btn btn-outline btn-sm border-success text-success hover:bg-success hover:text-success-content"
              title="Редактировать"
            >
              Редактировать
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
