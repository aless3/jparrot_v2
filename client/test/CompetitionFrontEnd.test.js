import { mount, shallow } from "enzyme";
import CompetitionFrontEnd from "../src/components/CompetitionFrontEnd";
import React from "react";
import axios from "axios";

test("check if CompetitionFrontEnd correctly creates the podium", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly updates creates the podium", async () => {
  await axios.get("http://localhost:8000/competition");
  const competition = shallow(<CompetitionFrontEnd />);

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly changes the keyword value", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let hashtag = competition.find("#keywordText").at(0);

  let newObj = {
    target: {
      value: "#test",
    },
  };
  hashtag.simulate("change", newObj);

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly changes the max_result value", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let maxResults = competition.find("#keywordSelect").at(0);

  let newObj = {
    target: {
      value: "200",
    },
  };
  maxResults.simulate("change", newObj);

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly responds to the button press", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let maxResults = competition.find("Button").at(0);

  maxResults.simulate("click");

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly responds to the mostliked button press", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let maxResults = competition.find("Button").at(1);

  maxResults.simulate("click");

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly responds to the open-ended button press", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let maxResults = competition.find("Button").at(2);

  maxResults.simulate("click");

  expect(competition).toMatchSnapshot();
});

test("check if CompetitionFrontEnd correctly responds to the multiple choise button press", async () => {
  const competition = shallow(<CompetitionFrontEnd />);

  let maxResults = competition.find("Button").at(3);

  maxResults.simulate("click");

  expect(competition).toMatchSnapshot();
});
