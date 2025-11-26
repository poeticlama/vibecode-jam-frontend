import { Link } from 'react-router';

type ExamCardProps = {
  cardTitle: string;
  id: string;
  className: string;
};

const ExamCard = ({ cardTitle, id, className }: ExamCardProps) => {
  return (
    <div
      className={'card bg-neutral-content card-xl shadow-sm' + className}
      key={id}
    >
      <div className="card-body flex flex-col justify-between">
        <h2 className="card-title text-neutral">{cardTitle}</h2>
        <div className="card-actions mt-5 flex flex-row gap-2">
          <Link className="btn btn-primary flex-1" to={`/admin/exam/${id}`}>
            Результаты
          </Link>
          <Link className="btn btn-secondary flex-1" to={`/admin/create/${id}`}>
            Редактировать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;