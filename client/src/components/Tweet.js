import React from "react";
import Card from "react-bootstrap/Card";
import { Row, Col, Container } from "react-bootstrap";

import {
  FaRetweet,
  FaReply,
  FaHeart,
  FaQuoteRight,
  FaCalendar,
} from "react-icons/fa";
import "./Tweet.css";

function Tweet({ user, tweet, stream }) {
  if (user === undefined) {
    console.error("UNDEFINED");
  } else {
    console.log("defined");
  }

  try {
    const { name, username, profile_image_url } = user;
    const { created_at, text } = tweet;
    const { like_count, quote_count, reply_count, retweet_count } = !stream
      ? tweet.public_metrics
      : 0;
    return (
      <Container className='card-container'>
        <Card border='light'>
          <Card.Header>
            <Row>
              <Col xs={1}>
                <img className='userimg' src={profile_image_url} alt={name} />
              </Col>
              <Col xs={11}>
                <div className='name'>{name}</div>
                <div className='username'>@{username}</div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Text as='div'>
              <div className='text'>{text}</div>
              <div className='tweet-details'>
                {!stream && (
                  <>
                    <div className='like'>
                      <FaHeart />
                      <div className='iconed'>{like_count}</div>
                    </div>
                    <div className='reply'>
                      <FaReply />
                      <div className='iconed'>{reply_count}</div>
                    </div>
                    <div className='retweet'>
                      <FaRetweet />
                      <div className='iconed'>{retweet_count}</div>
                    </div>
                    <div className='quote'>
                      <FaQuoteRight />
                      <div className='iconed'>{quote_count}</div>
                    </div>
                  </>
                )}
                <div className='date'>
                  <FaCalendar />
                  <div className='iconed'>{created_at.split("T")[0]}</div>
                  <div>{created_at.split("T")[1].split(".")[0]}</div>
                </div>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <></>;
  }
}

export default Tweet;
