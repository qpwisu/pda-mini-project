// Layout.jsx
import { Outlet } from 'react-router-dom';

import MyNavbar from './Header';
import MyFooter from './Footer';

// Layout.jsx

export default function Layout({ brandTitle, offCanvasTitle }) {
  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MyNavbar brandTitle={brandTitle} offCanvasTitle={offCanvasTitle} />
      <main
        style={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </main>
      <MyFooter brandTitle={brandTitle} />
    </div>
  );
}