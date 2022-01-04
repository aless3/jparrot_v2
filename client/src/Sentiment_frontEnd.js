import React, { useState } from "react";
import "./App.css";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function PieChart(data){

    console.log(data);

    let pos = data.positiveCount;
    let neg = data.negativeCount;

    let pieLabels = [`Positive Tweets`, `Negative Tweets`];

    let datasets = [{
        label: "Percentage of negative and positive tweets in the last seven days",
        data: [pos, neg],
        backgroundColor: [
            'rgb(137,234,102)',
            'rgb(189,73,73)',
        ],
        borderColor: [
            'rgb(94,211,52)',
            'rgb(199,48,48)',
        ],
        hoverBorderColor: [
            'rgb(77,222,25)',
            'rgb(227,20,20)',
        ],
        hoverOffset: 4

    }];

    return({
        labels: pieLabels,
        datasets: datasets,
    });

}

function LineChart(data) {
    let lineLabels = [];

    let positiveDataset = {};
    positiveDataset.data = [];
    positiveDataset.label = 'Positive Tweets'
    positiveDataset.fill = false;
    positiveDataset.backgroundColor = 'rgb(137,234,102)';
    positiveDataset.borderColor = 'rgb(137,234,102)';
    positiveDataset.tension = 0.1;


    let negativeDataset = {};
    negativeDataset.data = [];
    negativeDataset.label = 'Positive Tweets'
    negativeDataset.fill = false;
    negativeDataset.backgroundColor = 'rgb(189,73,73)';
    negativeDataset.borderColor = 'rgb(189,73,73)';
    negativeDataset.tension = 0.1;

    for (let i = 0; i < 8; i++) {
        console.log(data.days.length);
        let date = data.days[i].date.substr(0, 10); // yyyy/mm/dd is 10 characters
        lineLabels.push(date);

        let pos = data.days[i].pos_count;
        positiveDataset.data.push(pos);

        let neg = data.days[i].neg_count;
        negativeDataset.data.push(neg);
    }

    return ({
        labels: lineLabels,
        datasets: [positiveDataset, negativeDataset],
    });
}

function Sentiment_frontEnd() {

    const [keyword, setKeyword] = useState("");

    const [showLineData, setShowLineData] = useState(false);
    const [lineData, setLineData] = useState({});

    const [showPieData, setShowPieData] = useState(false);
    const [pieData, setPieData] = useState({});

    const [showSentimentData, setShowSentimentData] = useState(false);
    const [sentiment, setSentiment] = useState(0);
    const [sentimentName, setSentimentName] = useState("Neutral");


    function populatePieChart(data){
        setPieData(PieChart(data));
        setShowPieData(true);
    }


    function populateLineChart(data){
        setLineData(LineChart(data));
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
                        <Line type='line' data={lineData}/>
                    }
                </div>

                <div className='pie-chart'>
                    {showPieData &&
                        <Pie type='pie' data={pieData} />
                    }
                </div>
            </div>

        </div>
    );
}

export default Sentiment_frontEnd;
