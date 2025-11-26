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
        <div className="card-actions justify-end">
          <Link className="btn btn-primary mt-5" to={`/admin/exam/${id}`}>
            Перейти к экзамену
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
