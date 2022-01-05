import React from "react";
import "./App.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export class LineChartSentiment extends React.Component {
    constructor(props) {
        super(props);
    }

    computeData(){
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
            console.log(this.props.data.days.length);
            let date = this.props.data.days[i].date.substr(0, 10); // yyyy/mm/dd is 10 characters
            lineLabels.push(date);

            let pos = this.props.data.days[i].pos_count;
            positiveDataset.data.push(pos);

            let neg = this.props.data.days[i].neg_count;
            negativeDataset.data.push(neg);
        }

        return ({
            labels: lineLabels,
            datasets: [positiveDataset, negativeDataset],
        });
    }

    render() {
        let lineData = this.computeData();

        return(
            <div>
                <Line type='line' data={lineData}/>
            </div>
        );
    }
}