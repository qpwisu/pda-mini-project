import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';


function NewsCard({ id, image, title, date, content }) {
    const navigate = useNavigate()

    async function newsDetail() {
        navigate(`/detail/${id}`)
        console.log(id)
    }

    return (
        <Card onClick={newsDetail} style={{ width: '18rem', margin: '10px' }}>
          <Card.Img variant="top" src={image} style={{height: '200px'}}/>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Card.Title style={ {fontSize: "16px" }}>{title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted" style={{fontSize: "12px", marginTop: "5px", color: "#bbb"}}>{date}</Card.Subtitle>
            <Card.Text style={{ color: "#a9a9a9" }}>{content}...</Card.Text>
            {/* <Button variant="outline-primary">Read more</Button> */}
          </Card.Body>
        </Card>
    );
}

NewsCard.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};
NewsCard.defaultProps = {
    image: 'https://via.placeholder.com/150',
    content: '내용이 없습니다.',
    date: '날짜 없음',
  };

export default function MainPage(){
    const [newsList, setNewsList] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/news/main')
            .then(response => {
                setNewsList(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    return (
        <div>
            <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
                <h2>경제 뉴스</h2>
                <p style={{ color: '#666' }}>세상에서 가장 쉬운 경제 뉴스</p>
            </Container>

            <Container className="d-flex flex-wrap justify-content-start" style={{ display: 'flex', gap: '16px', padding: '0 12px'}}>
            {newsList.map((news) => (
                    <NewsCard
                    key={news.id}
                    id={news.id}
                    title={news.title}
                    image={news.imageURL}
                    content={news.preview}
                    date={news.published_at}
                    />
                ))}
        
        </Container>
        </div>
    )
}