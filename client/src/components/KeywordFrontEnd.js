import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { Col, Row, Container, Button } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import Neutral from "../icons/neutral.png";
import Sad from "../icons/sad.png";
import Pain from "../icons/pain.png";
import Happy from "../icons/happy.png";
import Smile from "../icons/smile.png";

import { PieChartSentiment } from "./PieChartSentiment";
import { LineChartSentiment } from "./LineChartSentiment";
import TweetList from "./TweetList";
import { SimpleCloud } from "./SimpleCloud";
import "./KeywordFrontEnd.css";

export function emoijImage(sentiment, callback) {
  switch (sentiment) {
    case 2:
      callback(Happy);
      break;
    case 1:
      callback(Smile);
      break;
    case 0:
      callback(Neutral);
      break;
    case -1:
      callback(Sad);
      break;
    case -2:
      callback(Pain);
      break;

    default:
      callback(Neutral);
      break;
  }
}

function KeywordFrontEnd() {
  const [termsData, setTermsData] = useState([]);
  const [firstTermsSearch, setFirstTermsSearch] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [showLineData, setShowLineData] = useState(false);
  const [lineData, setLineData] = useState({});

  const [showPieData, setShowPieData] = useState(false);
  const [pieData, setPieData] = useState({});

  const [tweets, setTweets] = useState([]);
  const [emoijSt, setEmoijSt] = useState(Pain);

  const [sentiment, setSentiment] = useState(0);
  const [sentimentName, setSentimentName] = useState("Neutral");

  const [firstSearch, setFirstSearch] = useState(false);

  useEffect(async () => {
    if (firstTermsSearch) {
      await searchTrending();
    }
  }, [termsData, firstTermsSearch]);

  useEffect(() => {
    emoijImage(sentiment, setEmoijSt);
  });

  const searchTrending = async () => {
    const posOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    async function posSuccess(pos) {
      let latitude = pos.coords.latitude;
      let longitude = pos.coords.longitude;

      try {
        const result = await axios.get("http://localhost:8000/terms", {
          params: {
            latitude,
            longitude,
          },
        });

        if (result.data !== undefined) {
          setTermsData(result.data);
          // setTermsLoaded(true)
        }
      } catch (error) {
        console.error(error);
      }
    }

    function posError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        posSuccess,
        posError,
        posOptions
      );
    }

    setFirstTermsSearch(false);
  };

  async function searchKeyword() {
    try {
      let result = await axios.get("http://localhost:8000/keyword", {
        params: {
          keyword,
        },
      });

      if (result.data !== undefined) {
        setTweets(() => {
          return result.data;
        });
      } else {
        console.log("data is undefined");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchSentiment() {
    try {
      let result = await axios.get("http://localhost:8000/sentiment", {
        params: {
          keyword,
        },
      });

      if (result.data !== undefined) {
        populateLineChart(result.data);
        populatePieChart(result.data);
        setSentiment(result.data.sentiment);
        setSentimentName(result.data.sentimentName);
      } else {
        console.log("data is undefined");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function populatePieChart(data) {
    setPieData(data);
    setShowPieData(true);
  }

  function populateLineChart(data) {
    setLineData(data);
    setShowLineData(true);
  }

  async function search() {
    await searchKeyword();
    await searchSentiment();
    setFirstSearch(true);
    setShowLineData(true);
    setShowPieData(true);
  }

  return (
    <Container>
      <br />
      <div>
        <h2 style={{ textAlign: "center", color: "white" }}>
          Ricerca per keyword
        </h2>
        <br />
        <h3 style={{ textAlign: "center", color: "white" }}>Termcloud</h3>
        <div className='d-flex justify-content-center'>
          <SimpleCloud
            values={termsData}
            setter={setKeyword}
            className='cloud'
          />
        </div>
        <br />
        <div className='d-flex justify-content-center'>
          <Button variant='outline-light' onClick={searchTrending}>
            Load/Reload
          </Button>
        </div>
      </div>
      <hr />

      <Row>
        <Col md={{ span: 5, offset: 3 }}>
          <FormControl
            type='text'
            value={keyword}
            placeholder='Inserisci la keyword...'
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </Col>
        <Col>
          <Button variant='outline-light' onClick={search}>
            Cerca
          </Button>{" "}
        </Col>
      </Row>

      {firstSearch && (
        <div className={"searchedView"}>
          <br />

          <br />

          <Row className='charts'>
            <Col xs={8}>
              {showLineData && (
                <div>
                  <h3 style={{ textAlign: "center", color: "white" }}>
                    Line Chart
                  </h3>
                  <div className='line-chart'>
                    <LineChartSentiment data={lineData} />
                  </div>
                </div>
              )}
            </Col>

            <Col xs={4}>
              {showPieData && (
                <div>
                  <h3 style={{ textAlign: "center", color: "white" }}>
                    Pie Chart
                  </h3>
                  <div className='pie-chart'>
                    <PieChartSentiment
                      positiveCount={pieData.positiveCount}
                      negativeCount={pieData.negativeCount}
                    />
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <br />
          <Row>
            <Col xs={8}>
              <div>
                <h3 style={{ textAlign: "center", color: "white" }}>Tweets</h3>
                <br />
                <div className='tweets'>
                  {/* <ShowTweets tweets={tweets} users={users} /> */}
                  <TweetList tweets={tweets} stream={false} />
                </div>
              </div>
            </Col>
            <Col xs={4}>
              <div>
                <h3 style={{ textAlign: "center", color: "white" }}>
                  Sentiment
                </h3>
                <br />
                <div className='sentiment'>
                  <h4 style={{ textAlign: "center", color: "white" }}>
                    The sentiment value of tweets with this keyword is{" "}
                    <b>{sentimentName}</b> (value: {sentiment})
                  </h4>
                  <br />
                  <div className='d-flex justify-content-center'>
                    <img
                      style={{ width: "77%", height: "77%" }}
                      src={emoijSt}
                      alt={emoijSt}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}

export default KeywordFrontEnd;
