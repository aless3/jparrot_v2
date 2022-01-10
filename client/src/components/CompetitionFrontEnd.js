import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";

import Podium from "./Podium";

function CompetitionFrontEnd() {
  const [hashtag, setHashtag] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  const [tweets, setTweets] = useState([]);
  const [showTweets, setShowTweets] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const interval = useRef(null);

  async function searchCompetitors() {
    try {
      let result = await axios.get("http://localhost:8000/competition", {
        params: {
          hashtag,
          maxResults,
        },
      });

      if (result.data !== undefined) {
        setTweets(() => {
          return result.data;
        });
        if (!firstSearch) {
          setFirstSearch(true);
        }
        setShowTweets(true);
      } else {
        console.log("data is undefined");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setMaxResultsHandler = (max) => {
    let number = parseInt(max);
    if (!isNaN(number)) {
      setMaxResults(number);
      console.log(number);
    }
  };

  const setUpInterval = () => {
    clearInterval(interval.current);
    interval.current = setInterval(async () => {
      await searchCompetitors();
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <div className='container'>
      <br />
      <h2 style={{ textAlign: "center", color: "white" }}>Competition</h2>
      <br />
      <div className='d-flex justify-content-center gap-3'>
        <Form.Control
          id='keywordText'
          style={{ width: "40%" }}
          type='text'
          value={hashtag}
          onChange={(e) => {
            setHashtag(e.target.value);
          }}
          placeholder='Inserisci la keyword...'
        />
        <Form.Select
          id='keywordSelect'
          style={{ width: "10%" }}
          type='text'
          value={maxResults}
          onChange={(e) => {
            setMaxResultsHandler(e.target.value);
          }}
        >
          <option value='100'>100</option>
          <option value='150'>150</option>
          <option value='200'>200</option>
        </Form.Select>

        <Button
          variant='outline-light'
          onClick={async () => {
            setUpInterval();
            await searchCompetitors();
          }}
        >
          Search
        </Button>
      </div>
      {showTweets && <Podium tweets={tweets} />}
    </div>
  );
}

export default CompetitionFrontEnd;
