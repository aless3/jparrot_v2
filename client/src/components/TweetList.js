import React from 'react'
import { Card } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

const TweetList = (tweet) => {
    const tweets = tweet.elementi;
    const lista = tweets.map((elemento) =>
    <div>
        <br />
        <Container>
        <Card className="mx-auto" border="light" style={{ width: '55vw' }}>
    <Card.Header>
    <Row>
    <Col xs={1}><img className='userimg' src={elemento.includes.users.filter((user) => user.id == elemento.data.author_id)[0].profile_image_url} alt={elemento.includes.users.filter((user) => user.id == elemento.data.author_id)[0].name} /></Col>
    <Col xs={11}><div className='name'>{elemento.includes.users.filter((user) => user.id == elemento.data.author_id)[0].name}</div><div className='username'>@{elemento.includes.users.filter((user) => user.id == elemento.data.author_id)[0].username}</div></Col>
    </Row>
    </Card.Header>
    <Card.Body>
      <Card.Title>
      {elemento.data.text}
      </Card.Title>
    </Card.Body>
  </Card>
  </Container>
      </div>
    );
    return (
        <>
        <ul>{lista}</ul>
        </>
    )
}

export default TweetList;
