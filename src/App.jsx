//import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import mainRouter from '~/routers/main-router';

import { Provider } from 'react-redux';
import store from './store/store';
function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(checkAuth()); // 애플리케이션 시작 시 인증 상태 확인
  // }, [dispatch]);

  return (
    <Provider store={store}>
      {/* Provider로 앱 감싸기 */}
      <RouterProvider router={mainRouter} />
    </Provider>
  );
}

export default App;
