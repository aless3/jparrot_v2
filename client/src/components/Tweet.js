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
  if (!user || !tweet) {
    console.log("user and/or tweet is null");
    return null;
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
              <Col className='tweet-top'>
                <img className='userimg' src={profile_image_url} alt={name} />
                <div>
                  <div className='name'>{name}</div>
                  <div className='username'>@{username}</div>
                </div>
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
                      <div className='icon-container'>{like_count}</div>
                    </div>
                    <div className='reply'>
                      <FaReply />
                      <div className='icon-container'>{reply_count}</div>
                    </div>
                    <div className='retweet'>
                      <FaRetweet />
                      <div className='icon-container'>{retweet_count}</div>
                    </div>
                    <div className='quote'>
                      <FaQuoteRight />
                      <div className='icon-container'>{quote_count}</div>
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
    return null;
  }
}

export default Tweet;
