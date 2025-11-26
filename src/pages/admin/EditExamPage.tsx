import TaskCard from '../../components/admin/TaskCard.tsx';

const EditExamPage = () => {
  const session = mock_session;
  const tasks = session.tests.map((test) => test.questions).flat();

  return (
    <div className="flex flex-col items-center">
      {tasks.map((task, index) => (
        <TaskCard task={task} index={index} />
      ))}
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
