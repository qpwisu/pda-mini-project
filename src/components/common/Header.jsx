import {
  Container,
  Nav,
  Navbar,
  Button,
  NavDropdown,
  Form,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';
// import useAuth from '~/lib/hooks/useAuth';
// import { serverLogout } from '~/lib/apis/auth';

const EXPAND_BREAKPOINT = 'md';

export default function MyNavbar({ brandTitle, offCanvasTitle }) {
  // 로그인 기능 관련 코드를 주석 처리하여 현재 로그인 상태와 관계없이 Navbar를 렌더링합니다.
  // const { user, clientLogout } = useAuth();
  return (
    // <Navbar
    //   expand={EXPAND_BREAKPOINT}
    //   className="mb-3"
    //   sticky="top"
    //   bg="dark"
    //   variant="dark"
    // >
    //   <Container fluid>
    //     <Navbar.Brand href="#">{brandTitle}</Navbar.Brand>
    //     <Navbar.Toggle aria-controls={`Navbar-expand-${EXPAND_BREAKPOINT}`} />
    //     <Navbar.Offcanvas
    //       id={`Navbar-expand-${EXPAND_BREAKPOINT}`}
    //       aria-labelledby={`NavbarLabel-expand-${EXPAND_BREAKPOINT}`}
    //       placement="end"
    //     >
    //       <Offcanvas.Header closeButton>
    //         <Offcanvas.Title id={`NavbarLabel-expand-${EXPAND_BREAKPOINT}`}>
    //           {offCanvasTitle || brandTitle}
    //         </Offcanvas.Title>
    //       </Offcanvas.Header>

    //       <Offcanvas.Body className="flex-row-reverse">
    //         <Nav
    //           className={`justify-content-around flex-row pb-4 pb-${EXPAND_BREAKPOINT}-0`}
    //         >
    //           {/* 로그인과 회원가입 관련 탭 주석 처리 */}
    //           {/* {!user ? (
    //             <>
    //               <Nav.Link
    //                 as="div"
    //                 className="flex-grow-1 text-center border border-dark border-end-0"
    //               >
    //                 <Link to="/login" state={{ redirect: 'redirectUri' }}>
    //                   로그인
    //                 </Link>
    //               </Nav.Link>
    //               <Nav.Link
    //                 as="div"
    //                 className="flex-grow-1 text-center border border-dark"
    //               >
    //                 <Link to="/signup">회원가입</Link>
    //               </Nav.Link>
    //             </>
    //           ) : (
    //             <Nav.Link
    //               as="div"
    //               className="flex-grow-1 text-center border border-dark border-end-0"
    //               onClick={() => {
    //                 serverLogout();
    //                 clientLogout();
    //               }}
    //             >
    //               로그아웃
    //             </Nav.Link>
    //           )} */}
    //         </Nav>
    //         <Nav className="justify-content-start flex-grow-1 pe-3">
    //           <Nav.Link href="#action1">Home</Nav.Link>
    //           <Nav.Link href="#action2">게시판</Nav.Link>
    //         </Nav>
    //       </Offcanvas.Body>
    //     </Navbar.Offcanvas>
    //   </Container>
    // </Navbar>
    <Navbar expand="lg" className="bg-body-tertiary" style={{padding: "0"}}>
      <Container fluid style={{background: "#FFF7F0"}}>
        <Navbar.Brand href="#" style={{ color: '#F8C39A', fontWeight: 'bold', fontSize: "25px"}}>
          Economic
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#all">All</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success" style={{ backgroundColor: '#F8C39A', borderColor: '#F8C39A', color: 'white' }}>Search</Button> {/* Button 컴포넌트 사용 */}
          </Form>
          <NavDropdown
            title="MyPage"
            id="navbarScrollingDropdown"
            align="end"
            style={{ marginLeft: '30px', marginRight: '20px'}}
          >
            <NavDropdown.Item href="#policy">Economic Policy</NavDropdown.Item>
            <NavDropdown.Item href="#company">Companies</NavDropdown.Item>
            <NavDropdown.Item href="#finance">Finance</NavDropdown.Item>
            <NavDropdown.Item href="#global">Global</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#more">Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}