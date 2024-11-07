import PropTypes from 'prop-types';
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
        navigate(`/news/${id}`)
        console.log(id)
    }

    return (
        <Card onClick={newsDetail} style={{ width: '18rem', margin: '10px' }}>
          <Card.Img variant="top" src={image} style={{height: '200px'}}/>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Card.Title>{title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted" style={{fontSize: "12px", marginTop: "5px", color: "#bbb"}}>{date}</Card.Subtitle>
            <Card.Text style={{ color: "#a9a9a9" }}>{content}</Card.Text>
            {/* <Button variant="outline-primary">Read more</Button> */}
          </Card.Body>
        </Card>
    );
}

NewsCard.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    category: PropTypes.string,
};

export default function MainPage(){
    return (
        <div>
            <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
                <h2>경제 뉴스</h2>
                <p style={{ color: '#666' }}>세상에서 가장 쉬운 경제 뉴스</p>
            </Container>

            <Container className="d-flex flex-wrap justify-content-start" style={{ display: 'flex', gap: '16px', padding: '0 12px'}}>
            <NewsCard 
            id="1"
            image="https://via.placeholder.com/150" 
            title="Sample News Title 1" 
            date="2024년 10월 23일 (수)" 
            content="This is a short summary of the news content. It provides a brief overview to engage readers and encourage them to read more." 
            category="Economy"/>
            
            <NewsCard
            id="2"
            image="https://via.placeholder.com/150"
            title="Sample News Title 2" 
            date="2024년 10월 22일 (화)" 
            content="Another brief 
            summary to demonstrate the card layout. This card provides insights into a different topic." 
            category="Finance"/>
        
            <NewsCard 
            id="3"
            image="https://via.placeholder.com/150" 
            title="Sample News Title 3" 
            date="2024년 10월 21일 (월)" 
            content="This news card shows a different article. It can be customized with unique images, titles, and summaries." 
            category="Global"/>
            
            <NewsCard 
            id="4"
            image="https://via.placeholder.com/150" 
            title="Sample News Title 4" 
            date="2024년 10월 20일 (일)" 
            content="The last sample card in this example. It is designed to create a visually appealing grid layout." 
            category="Industry"/>
        
        </Container>
        </div>
    )
}