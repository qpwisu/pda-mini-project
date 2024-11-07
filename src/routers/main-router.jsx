// Router: 각 URL에 따른 page 컴포넌트 연결

// import functionName from "~/routes/화면/page"

// import BoardLayout from '~/routes/board/layout';
// import BoardListPage from "~/routes/board/page";
// import BoardDetailPage from "~/routes/board/detail/page";
// import LoginPage from "~/routes/login/page";
// import SignupPage from "~/routes/signup/page";
// import SearchPage from "~/routes/search/page";

import { createBrowserRouter } from 'react-router-dom';

import MainPage from '~/routes/mainPage/main';
import Layout from '~/components/common/Layout';

import MyPage from '~/routes/myPage/myPage';
import SignUp from '~/routes/signupPage/Signup';
import NewsDetail from '~/routes/newsDetailPage/NewsDetail';
import Search from '~/routes/searchPage/search';
import Login from '~/routes/loginPage/login';

export const mainRoutes = [
  {
    path: '/',
    element: <Layout brandTitle="Your Brand" offCanvasTitle="Menu" />,
    children: [
      { element: <MainPage />, index: true },
      { element: <MyPage />, path: 'mypage' },
      { element: <NewsDetail />, path: 'detail/:idx' },
      { element: <Search />, path: 'search' },
      { element: <SignUp />, path: 'signup' },
      { element: <Login />, path: 'login' },
    ],
  },
];

const router = createBrowserRouter(mainRoutes);
export default router;
