import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import mainRouter from '~/routers/main-router';

function App() {
  return <RouterProvider router={mainRouter} />;
}

export default App;
