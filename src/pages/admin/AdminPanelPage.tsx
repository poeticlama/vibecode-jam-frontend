import { Link } from 'react-router';

import ExamCard from '../../components/admin/ExamCard.tsx';

const AdminPanelPage = () => {
  const examCards = exams.map((exam) => (
    <ExamCard
      cardTitle={exam.cardTitle}
      id={exam.examId}
      className="carousel-item mx-3 w-80 flex-shrink-0"
    />
  ));

  return (
    <div className="h-full w-full px-3 py-10 md:px-10 lg:px-20">
      <h1 className="text-primary text-3xl font-bold">Панель администратора</h1>
      <Link className="btn btn-primary mt-15 mb-10 ml-4" to="create">
        + Создать экзамен
      </Link>
      <div className="carousel bg-base-200 w-full py-10">{examCards}</div>
    </div>
  );
};

const exams = [
  {
    cardTitle: 'Экзамен по JavaScript для Middle Frontend разработчика',
    examId: '223',
  },
  {
    cardTitle: 'Экзамен по React.js для Middle Frontend разработчика',
    examId: '224',
  },
  {
    cardTitle: 'Экзамен по TypeScript для Middle Frontend разработчика',
    examId: '225',
  },
  {
    cardTitle: 'Экзамен по Vue.js для Middle Frontend разработчика',
    examId: '226',
  },
  {
    cardTitle: 'Экзамен по Angular для Middle Frontend разработчика',
    examId: '227',
  },
  {
    cardTitle: 'Экзамен по HTML/CSS для Middle Frontend разработчика',
    examId: '228',
  },
  {
    cardTitle: 'Экзамен по Node.js для Middle Backend разработчика',
    examId: '229',
  },
  {
    cardTitle: 'Экзамен по Python для Middle Backend разработчика',
    examId: '230',
  },
];

export default AdminPanelPage;
