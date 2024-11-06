import Header from '~/components/common/Header';
import Footer from '~/components/common/Footer';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function LayoutPage() {
  return (
    <div>
      <Header brandTitle="news-8" />
      <Container className="min-vh-100">
        <Outlet />
      </Container>
      <Footer brandTitle="news-8" />
    </div>
  );
}
