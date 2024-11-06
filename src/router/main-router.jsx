// Router: 각 URL에 따른 page 컴포넌트 연결
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '~/routes/page';

import BoardLayout from '~/routes/board/layout';
import BoardListPage from '~/routes/board/page';
import BoardDetailPage from '~/routes/board/detail/page';
import LoginPage from '~/routes/login/page';
import SignupPage from '~/routes/signup/page';

export const mainRoutes = [
  {
    path: '/',
    element: <BoardLayout />,
    children: [
      { element: <MainPage />, index: true },
      { element: <LoginPage />, path: 'login' },
      { element: <SignupPage />, path: 'signup' },
      {
        path: '/board',
        // element: <BoardListPage />,
        // index: true,
        children: [
          {
            path: '',
            index: true,
            element: <BoardListPage />,
          },
          {
            path: ':boardId',
            element: <BoardDetailPage />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(mainRoutes);
export default router;
