import { shallow } from "enzyme";
import { PieChartSentiment } from "../src/components/PieChartSentiment";
import React from "react";
import axios from "axios";

test("check if the component renders correctly using stored blobs", async () => {
  const sentiment = await axios.get("http://localhost:8000/sentiment");

  const pieChart = shallow(
    <PieChartSentiment
      positiveCount={sentiment.data.positiveCount}
      negativeCount={sentiment.data.negativeCount}
    />
  );

  expect(pieChart).toMatchSnapshot();
});
