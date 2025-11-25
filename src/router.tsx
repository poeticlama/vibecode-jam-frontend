import { createBrowserRouter } from 'react-router';

import Home from './pages/Home.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);
