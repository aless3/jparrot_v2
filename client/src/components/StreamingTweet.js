import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import "./StreamingTweet.css";
import "bootstrap/dist/css/bootstrap.css";
import Tweet from "./Tweet";
import TweetList from "./TweetList";

const StreamingTweet = () => {
  var socket = useRef(null);

  const [text, setText] = useState("");
  const [tweets, setTweets] = useState([]);
  const [showText, setShowText] = useState(false);

  const handleChangeOn = () => {
    if (!showText) {
      setShowText(true);
    }
  };

  const handleChangeOff = () => {
    if (showText) {
      setShowText(false);
    }
  };

  async function start() {
    handleChangeOn();
    console.log(text);
    socket.current = io("http://localhost:8000", { transports: ["websocket"] });
    socket.current.on("connect", () => {
      console.log(socket.current.id);
    });
    await socket.current.emit("start-stream", text); //Funzia con una palora
    console.log("streaming started");
    socket.current.on("tweet", (tweet) => {
      setTweets((tweets) => [tweet, ...tweets]);
    });
  }

  async function end() {
    handleChangeOff();
    await socket.current.emit("end-stream");
    console.log("streaming ended");
    socket.current.disconnect();
    console.log("disconnected");
  }

  return (
    <div>
      <Container>
        <Row>
          <Col xs={2}>
            <Button variant='secondary' onClick={start}>
              Inizia
            </Button>{" "}
            <Button variant='secondary' onClick={end}>
              Ferma
            </Button>{" "}
          </Col>
          <Col>
            <InputGroup className=''>
              <FormControl
                aria-label='Default'
                aria-describedby='inputGroup-sizing-default'
                placeholder='Inserisci la keyword...'
                onChange={(e) => setText(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <br />
      <div className='d-flex justify-content-center'>
        {showText && <h4 className='pulser'>Sto cercando i tweet</h4>}
      </div>
      <TweetList elementi={tweets}></TweetList>
    </div>
  );
};

export default StreamingTweet;
