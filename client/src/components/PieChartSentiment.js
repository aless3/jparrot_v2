import React from "react";
import "../App.css";

import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export class PieChartSentiment extends React.Component {
    pieLabels = [`Positive Tweets`, `Negative Tweets`];

    computeDatasets(){
        return [{
            label: "Percentage of negative and positive tweets in the last seven days",
            data: [this.props.positiveCount, this.props.negativeCount],
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
    }

    render() {
        let pieData = {
            labels: this.pieLabels,
            datasets: this.computeDatasets(),
        }

        return(
            <div>
                <Pie type={"pie"} data={pieData} />
            </div>
        );
    }
}