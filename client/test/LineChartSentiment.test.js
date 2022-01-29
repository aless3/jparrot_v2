import { shallow } from "enzyme";
import { LineChartSentiment } from "../src/components/LineChartSentiment";
import React from "react";
import axios from "axios";

test("check if the component renders correctly using stored blobs", async () => {
  const sentiment = await axios.get("http://localhost:8000/sentiment");

  const lineChart = shallow(<LineChartSentiment data={sentiment.data} />);

  expect(lineChart).toMatchSnapshot();
});
