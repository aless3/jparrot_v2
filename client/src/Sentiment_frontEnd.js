import React, { useState } from "react";
import "./App.css";
import axios from "axios";

import { PieChartSentiment } from "./PieChartSentiment";
import { LineChartSentiment } from "./LineChartSentiment";

export function Sentiment_frontEnd() {

    const [keyword, setKeyword] = useState("");

    const [showLineData, setShowLineData] = useState(false);
    const [lineData, setLineData] = useState({});

    const [showPieData, setShowPieData] = useState(false);
    const [pieData, setPieData] = useState({});

    const [showSentimentData, setShowSentimentData] = useState(false);
    const [sentiment, setSentiment] = useState(0);
    const [sentimentName, setSentimentName] = useState("Neutral");

    function populatePieChart(data){
        setPieData(data)
        setShowPieData(true);
    }


    function populateLineChart(data){
        setLineData(data);
        setShowLineData(true);
    }


    const searchSentiment = async () => {
        try {
            console.log(keyword);
            let result = await axios.get("http://localhost:8000/sentiment", {
                params: {
                    keyword
                },
            });

            if(result.data !== undefined){
                populateLineChart(result.data);
                populatePieChart(result.data);

                setSentiment(result.data.sentiment);
                setSentimentName((result.data.sentimentName));
                setShowSentimentData(true);
            }else {
                console.log("data is undefined");
            }
        } catch (error) {
            console.error(error);
        }
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
            <button onClick={searchSentiment}>Reload</button>

            <div className="sentiment">
                {showSentimentData &&
                    <p>The sentiment value of tweets with this keyword is <b>{sentimentName}</b> (value: {sentiment})</p>
                }
            </div>

            <div className='charts'>
                <div className='line-chart'>
                    {showLineData &&
                        <LineChartSentiment data={lineData}/>
                    }
                </div>

                <div className='pie-chart'>
                    {showPieData &&
                        <PieChartSentiment positiveCount={pieData.positiveCount} negativeCount={pieData.negativeCount} />
                    }
                </div>
            </div>

        </div>
    );
}
