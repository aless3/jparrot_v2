import React, { useState } from "react";
import "../App.css";
import axios from "axios";

import { PieChartSentiment } from "./PieChartSentiment";
import { LineChartSentiment } from "./LineChartSentiment";
import { useLocation } from "react-router-dom";
import TweetList from "./TweetList";

function KeywordFrontEnd() {
  let prevKeyword;
  const { state } = useLocation();

  try {
    prevKeyword = state.prevKeyword;
  } catch (e) {
    prevKeyword = "";
  }

  const [keyword, setKeyword] = useState(prevKeyword);

  const [showLineData, setShowLineData] = useState(false);
  const [lineData, setLineData] = useState({});

  const [showPieData, setShowPieData] = useState(false);
  const [pieData, setPieData] = useState({});

  const [tweets, setTweets] = useState([]);
  const [showTweets, setShowTweets] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const [showSentimentData, setShowSentimentData] = useState(false);
  const [sentiment, setSentiment] = useState(0);
  const [sentimentName, setSentimentName] = useState("Neutral");

  const [firstSearch, setFirstSearch] = useState(false);

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
        setShowSentimentData(true);
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
  }

  function toggleShowCharts() {
    if (!firstSearch) return;
    setShowCharts(!showCharts);
  }

  function toggleShowLineChart() {
    if (!firstSearch) return;
    setShowLineData(!showLineData);
  }

  function toggleShowPieChart() {
    if (!firstSearch) return;
    setShowPieData(!showPieData);
  }

  function toggleShowTweets() {
    if (!firstSearch) return;
    setShowTweets(!showTweets);
  }

  function toggleShowSentiment() {
    if (!firstSearch) return;
    setShowSentimentData(!showSentimentData);
  }

  return (
    <div className='container'>
      <div className='label'>Insert keyword</div>
      <input
        type='text'
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />

      <button onClick={search}>Search</button>

      {firstSearch && (
        <div className={"searchedView"}>
          <button onClick={toggleShowSentiment}>Toggle Show Sentiment</button>
          {showSentimentData && (
            <div className='sentiment'>
              <p>
                The sentiment value of tweets with this keyword is{" "}
                <b>{sentimentName}</b> (value: {sentiment})
              </p>
            </div>
          )}

          <button onClick={toggleShowCharts}>Toggle Show Charts</button>
          {showCharts && (
            <div className='charts'>
              <button onClick={toggleShowLineChart}>Toggle Line Chart</button>
              {showLineData && (
                <div className='line-chart'>
                  <LineChartSentiment data={lineData} />
                </div>
              )}

              <button onClick={toggleShowPieChart}>Toggle Pie Chart</button>
              {showPieData && (
                <div className='pie-chart'>
                  <PieChartSentiment
                    positiveCount={pieData.positiveCount}
                    negativeCount={pieData.negativeCount}
                  />
                </div>
              )}
            </div>
          )}

          <button onClick={toggleShowTweets}>Toggle Show Tweets</button>
          {showTweets && (
            <div className='tweets'>
              {/* <ShowTweets tweets={tweets} users={users} /> */}
              <TweetList tweets={tweets} stream={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KeywordFrontEnd;
