// Router: 각 URL에 따른 page 컴포넌트 연결

// import functionName from "~/routes/화면/page"

// import BoardLayout from '~/routes/board/layout';
// import BoardListPage from "~/routes/board/page";
// import BoardDetailPage from "~/routes/board/detail/page";
// import LoginPage from "~/routes/login/page";
// import SignupPage from "~/routes/signup/page";
// import SearchPage from "~/routes/search/page";

import { createBrowserRouter } from 'react-router-dom';

import MainPage from '~/routes/main/page';
import LayoutPage from '~/routes/layout/page';

import SearchResultsPage from '~/routes/search/page';

export const mainRoutes = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { element: <MainPage />, index: true },
      { element: <SearchResultsPage />, path: 'search' },
    ],
  },
];

const router = createBrowserRouter(mainRoutes);
export default router;
