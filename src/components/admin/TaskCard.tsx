type Question = {
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
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const options = [
    { key: 'a', label: 'A', text: task.optionA },
    { key: 'b', label: 'B', text: task.optionB },
    { key: 'c', label: 'C', text: task.optionC },
    { key: 'd', label: 'D', text: task.optionD },
  ];

  return (
    <div className="border-base-300 bg-base-100 mb-4 w-full max-w-md rounded-lg border p-3 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-4 md:max-w-lg md:p-5 lg:max-w-xl">
      {/* Заголовок задания */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base-content text-md font-semibold md:text-lg">
          Задание {index + 1}
        </h3>
      </div>

      {/* Текст вопроса */}
      <div className="mb-4">
        <p className="text-base-content text-xs leading-relaxed sm:text-sm">
          {task.text}
        </p>
      </div>

      {/* Варианты ответов */}
      <div className="space-y-2 sm:space-y-3">
        {options.map((option) => (
          <div
            key={option.key}
            className={`flex items-center rounded-lg border p-3 text-xs transition-all duration-200 sm:p-1 sm:text-sm md:p-2 ${
              option.key === task.correctAnswer
                ? 'border-success bg-success/10'
                : 'border-base-300 bg-base-200'
            } `}
          >
            <div
              className={`mr-2 flex h-5 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold sm:mr-3 sm:h-6 sm:w-6 ${
                option.key === task.correctAnswer
                  ? 'bg-success text-success-content'
                  : 'bg-neutral text-neutral-content'
              } `}
            >
              {option.label}
            </div>
            <span className="text-base-content flex-1 pt-0.5">
              {option.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
