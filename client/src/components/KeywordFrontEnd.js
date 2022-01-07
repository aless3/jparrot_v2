import React, { useEffect, useState} from "react";
import "../App.css";
import axios from "axios";

import { PieChartSentiment } from "./PieChartSentiment";
import { LineChartSentiment } from "./LineChartSentiment";
import TweetList from "./TweetList";
import { SimpleCloud } from "./SimpleCloud";

function KeywordFrontEnd() {

  const [termsData, setTermsData] = useState([]);
  const [firstTermsSearch, setFirstTermsSearch] = useState(true);

  const [keyword, setKeyword] = useState("");

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

  useEffect(async () => {
    if(firstTermsSearch){
      await searchTrending();
    }
  }, [termsData, firstTermsSearch]);

  const searchTrending = async () => {
    const posOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    async function posSuccess(pos) {
      let latitude = pos.coords.latitude;
      let longitude = pos.coords.longitude;

      try {
        const result = await axios.get("http://localhost:8000/terms", {
          params: {
            latitude,
            longitude
          },
        });

        if(result.data !== undefined){

          setTermsData(result.data)
          // setTermsLoaded(true)
        }
      } catch (error) {
        console.error(error);
      }
    }

    function posError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(posSuccess, posError, posOptions);
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
    setShowCharts(true);
    setShowLineData(true);
    setShowTweets(true);
    setShowPieData(true);
    setShowSentimentData(true);
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
      <div className='term-container'>
        <button onClick={searchTrending}>Load/Reload</button>
            <div className='term-cloud'>
              <SimpleCloud values={termsData} setter={setKeyword} className='cloud' />
            </div>
      </div>


      <div className='label'>Insert keyword</div>
      <input
        type="text"
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
            <div className="sentiment">
              <p>
                The sentiment value of tweets with this keyword is{" "}
                <b>{sentimentName}</b> (value: {sentiment})
              </p>
            </div>
          )}

          <button onClick={toggleShowCharts}>Toggle Show Charts</button>
          {showCharts && (
            <div className="charts">
              <button onClick={toggleShowLineChart}>Toggle Line Chart</button>
              {showLineData && (
                <div className="line-chart">
                  <LineChartSentiment data={lineData} />
                </div>
              )}

              <button onClick={toggleShowPieChart}>Toggle Pie Chart</button>
              {showPieData && (
                <div className="pie-chart">
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
            <div className="tweets">
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
