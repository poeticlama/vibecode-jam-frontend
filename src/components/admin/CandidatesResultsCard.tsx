import type { CandidateResult } from '../../types/sessions.ts';

type CandidatesResultsProps = {
  result: CandidateResult;
};

const CandidatesResults = ({ result }: CandidatesResultsProps) => {
  return (
    <div className="border-base-300 bg-base-100 mb-5 w-full rounded-xl border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base-content text-xl font-bold">
          {result.candidateName}
        </h3>
        {result.violationDetected && (
          <div className="badge badge-error badge-lg">Нарушение правил</div>
        )}
      </div>
      <div className="text-base-content/70 mb-4 text-sm">
        Отправлено: {new Date(result.submittedAt).toLocaleString('ru-RU')}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-base-content mb-2 font-semibold">
            Результаты тестов:
          </h4>
          <div className="text-base-content bg-base-200 rounded-lg p-4 text-sm whitespace-pre-wrap">
            {result.testResults + "%" || 'Нет данных'}
          </div>
        </div>
        <div>
          <h4 className="text-base-content mb-2 font-semibold">
            Результаты алгоритмов:
          </h4>
          <div className="text-base-content bg-base-200 rounded-lg p-4 text-sm whitespace-pre-wrap">
            {result.algorithmResults + "%" || 'Нет данных'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesResults;
