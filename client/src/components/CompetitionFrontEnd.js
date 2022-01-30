import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { ButtonGroup, FormControl, Form } from "react-bootstrap";

import Podium from "./Podium";

function CompetitionFrontEnd() {
  const [hashtag, setHashtag] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  const [tweets, setTweets] = useState([]);
  const [showTweets, setShowTweets] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [showMultiple, setShowMultiple] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [rawError, setRawError] = useState("");
  const interval = useRef(null);

  function showM() {
    setShowOpen(true);
    setShowMultiple(true);
  }

  function showO() {
    setShowOpen(true);
    setShowMultiple(false);
    setRawError("");
  }

  function dshowMO() {
    setShowOpen(false);
    setShowMultiple(false);
    setCorrectAnswer("");
    setRawError("");
  }

  async function searchCompetitors() {
    try {
      const wrongAnswers = setError(rawError);

      if (wrongAnswers.length && !correctAnswer) {
        clearInterval(interval.current);
        setShowTweets(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        return;
      }

      let result = await axios.get("http://localhost:8000/competition", {
        params: {
          hashtag,
          maxResults,
          ...(correctAnswer ? { correctAnswer } : { correctAnswer: null }),
          ...(wrongAnswers.length ? { wrongAnswers } : { wrongAnswers: null }),
        },
      });
      setUpInterval();
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

  const setError = (errors) => {
    let arr = [];
    errors.split(", ").forEach((el) => {
      console.log(el);
      if (el) {
        arr.push(el);
      }
    });
    return arr;
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
          placeholder='Enter a Keyword...'
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
          <option value='250'>250</option>
          <option value='300'>300</option>
          <option value='350'>350</option>
          <option value='400'>400</option>
          <option value='450'>450</option>
        </Form.Select>

        <Button
          id='searchButton'
          variant='outline-light'
          onClick={async () => {
            await searchCompetitors();
          }}
        >
          Search
        </Button>
      </div>
      <br />
      <div className='d-flex justify-content-center'>
        <ButtonGroup>
          <Button onClick={dshowMO} variant='outline-light'>
            Most liked
          </Button>
          <Button onClick={showO} variant='outline-light'>
            Open-ended questions
          </Button>
          <Button
            onClick={showM}
            variant='outline-light'
            data-testid='multipleButton'
          >
            Multiple choice questions
          </Button>
        </ButtonGroup>
      </div>
      <br />
      {showError && (
        <h5 style={{ color: "red", textAlign: "center" }}>
          No correct answers for these wrong answers
        </h5>
      )}

      <div className='d-flex justify-content-around'>
        {showOpen && (
          <FormControl
            id='OpenEnded'
            value={correctAnswer}
            className='w-25'
            placeholder='Correct answer'
            onChange={(e) => {
              setCorrectAnswer(e.target.value);
            }}
          />
        )}
        {showMultiple && (
          <FormControl
            id='Multiple'
            value={rawError}
            className='w-50'
            placeholder='Wrong answer'
            onChange={(e) => {
              setRawError(e.target.value);
            }}
          />
        )}
      </div>
      {showTweets && <Podium tweets={tweets} />}
    </div>
  );
}

export default CompetitionFrontEnd;
