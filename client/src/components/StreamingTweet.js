import React, { useState, useRef } from "react";
import io from "socket.io-client";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import "./StreamingTweet.css";
import "bootstrap/dist/css/bootstrap.css";
import TweetList from "./TweetList";
import "animate.css";

const StreamingTweet = () => {
  let socket = useRef(null);

  const [text, setText] = useState("");
  const [tweets, setTweets] = useState([]);
  const [showText, setShowText] = useState(false);
  const [showTweets, setShowTweets] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChangeOn = () => {
    setShowText(true);
  };

  const handleChangeOff = () => {
    setShowText(false);
  };

  async function start() {
    if (!text) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    handleChangeOn();
    socket.current = io("http://localhost:8000", { transports: ["websocket"] });
    socket.current.on("connect", () => {
      console.log(socket.current.id);
    });

    await socket.current.emit("start-stream", text); //Funzia con una palora
    console.log("streaming started");
    socket.current.on("tweet", (tweet) => {
      setTweets((ts) => [tweet, ...ts]);
      setShowTweets(true);
    });
  }

  async function end() {
    handleChangeOff();
    if (socket.current) {
      await socket.current.emit("end-stream");
      console.log("streaming ended");
      socket.current.disconnect();
      console.log("disconnected");
    }
  }

  return (
    <div>
      <Container>
        <Row>
          <Col xs={2}>
            <Button
              variant="outline-light"
              onClick={start}
              data-testid="startButton"
            >
              Start
            </Button>{" "}
            <Button
              variant="outline-light"
              onClick={end}
              data-testid="stopButton"
            >
              Stop
            </Button>{" "}
          </Col>
          <Col>
            <InputGroup className="">
              <FormControl
                data-testid="input"
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder="Enter a keyword..."
                onChange={(e) => setText(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        {showError && (
          <Row>
            <h5
              id="errorMsg"
              className="d-flex justify-content-center text-danger mt-2 animate__bounceIn"
            >
              No keywords entered!
            </h5>
          </Row>
        )}
      </Container>
      <br />
      <div className="d-flex justify-content-center">
        {showText && (
          <h4 id="searching" className="pulser">
            Looking for Tweets...
          </h4>
        )}
      </div>
      {showTweets && <TweetList tweets={tweets} stream={true} />}
    </div>
  );
};

export default StreamingTweet;
