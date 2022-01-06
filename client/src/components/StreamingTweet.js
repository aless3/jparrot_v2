import React, {useState, useEffect, useRef} from "react";
import io from 'socket.io-client';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import "./Streaming.css"
import { Card } from "react-bootstrap";
import TweetList from "./TweetList";
import {ShowTweets} from "./ShowTweets";


const StreamingTweet = () => {

  var socket = useRef(null);

  const [text, setText] = useState ("");
  const [elementi, setElementi] = useState([])

  const [tweetsQ, setTweetsQ] = useState([])
  const [usersQ, setUsersQ] = useState([])

  const [tweets, setTweets] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    socket = io.connect('http://localhost:8000', { transports : ['websocket'], 'force new connection': true })
    socket.on('connect', () => {
      console.log(socket.id)
    })
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setTweetsQ(tweets);
      setUsersQ(users);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [tweets, users]);


  useEffect(() => {
    socket.on('tweet', (tweet) => {

      console.log(tweet);

      // let text = tweet.data.text;
      // let includes = tweet.includes.users[0];

      // setElementi([...elementi, tweet.data.text])
      // if(tweet.data !== undefined && tweet.includes !== undefined && tweet.includes.users !== undefined && tweet.includes.users[0] !== undefined){
      //   let user = tweet.includes.users[0];
      //   if(user.name !== undefined && user.username !== undefined && user.profile_image_url !== undefined){
      //     // tweet and user are valid
      //     setTweetsQ([...tweets, tweet.data])
      //     setUsersQ([...users, user])
      //
      //     if(tweetsQ.length > 50 || usersQ.length > 50){
      //       setTweets([...tweetsQ])
      //       setUsers([...usersQ])
      //
      //       setTweetsQ([])
      //       setUsersQ([])
      //     }
      //
      //     // console.log(tweet.includes.users[0])
      //   }
      //     // name, username, profile_image_url
      //
      // }


      // if(tweet.includes !== undefined && tweet.includes.users !== undefined)
    })
  }, [tweets, users]);


  async function start() {
    console.log(text)
    await socket.emit('start-stream', text) //Funzia con una palora
    console.log('streaming started')
  }

  async function end(){
    await socket.emit('end-stream')
    console.log('streaming ended')
    // socket.disconnect()
    // console.log('disconnected')
  }

  async function disconnect() {
    socket.disconnect()
    console.log('disconnected')
  }


  return (
      <div>
        <Container>
          <Row>
            <Col xs={3}>
              <Button variant="secondary" onClick={start}>Inizia</Button>{' '}
              <Button variant="secondary" onClick={end}>Ferma</Button>{' '}
              {/*<Button variant="secondary" onClick={disconnect}>Scollegati</Button>{' '}*/}
            </Col>
            <Col>
              <InputGroup className="">
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Inserisci la keyword..." onChange={(e) => setText(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Container>
        {/*<ShowTweets tweets={tweets} users={users} />*/}
        {/*<TweetList elementi={elementi}/>*/}
      </div>
  );
}




export default StreamingTweet;