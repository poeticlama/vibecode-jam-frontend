import type { Test } from '../../types/sessions.ts';

type TestCardProps = {
  test: Test;
};

const TestCard = ({ test }: TestCardProps) => {
  return (
    <div className="border-base-300 bg-base-100 mb-4 w-full rounded-lg border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base-content text-xl font-bold">{test.topic}</h3>
        <div className="badge badge-primary badge-lg">
          {test.questionCount}{' '}
          {test.questionCount === 1 ? 'вопрос' : 'вопросов'}
        </div>
      </div>
      <div className="text-base-content/70 text-sm">
        Создано: {new Date(test.createdAt).toLocaleDateString('ru-RU')}
      </div>
      {test.questions && test.questions.length > 0 && (
        <div className="mt-4 space-y-3">
          {test.questions.map((question, index) => (
            <div
              key={question.id}
              className="border-base-300 bg-base-200 rounded-lg border p-3"
            >
              <div className="mb-2 text-sm font-semibold">
                Вопрос {index + 1}
              </div>
              <p className="text-base-content mb-3 text-sm">{question.text}</p>
              <div className="space-y-1">
                {[
                  { key: 'A', value: question.optionA },
                  { key: 'B', value: question.optionB },
                  { key: 'C', value: question.optionC },
                  { key: 'D', value: question.optionD },
                ].map((option) => (
                  <div
                    key={option.key}
                    className={`flex items-center rounded px-2 py-1 text-xs ${
                      option.key.toLowerCase() === question.correctAnswer
                        ? 'bg-success/20 text-success'
                        : 'bg-base-300/50'
                    }`}
                  >
                    <span className="mr-2 font-bold">{option.key}.</span>
                    <span>{option.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestCard;
