import { createBrowserRouter } from 'react-router';

import AdminPanelPage from './pages/admin/AdminPanelPage.tsx';
import EditExamPage from './pages/admin/EditExamPage.tsx';
import ExamFormPage from './pages/admin/ExamFormPage.tsx';
import ExamPage from './pages/admin/ExamPage.tsx';
import LoginPage from './pages/admin/LoginPage.tsx';
import ResultsPage from './pages/admin/ResultsPage.tsx';
import ExamPassingPage from './pages/candidate/ExamPassingPage.tsx';
import StartExamPage from './pages/candidate/StartExamPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/exam',
    element: <ExamPassingPage />,
  },
  {
    path: '/startExam/:candidateId',
    element: <StartExamPage />,
  },
  {
    path: '/admin',
    element: <AdminPanelPage />,
    children: [
      {
        path: 'create',
        element: <ExamFormPage />,
      },
      {
        path: 'edit/:id',
        element: <EditExamPage />,
      },
      {
        path: 'exam/:id',
        element: <ExamPage />,
      },
      {
        path: 'results/:id',
        element: <ResultsPage />,
      },
    ],
  },
]);
