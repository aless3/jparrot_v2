import {shallow} from "enzyme";
import TweetList  from "../src/components/TweetList";
import React from "react";

test("check if the component renders correctly using stored blobs", async () => {

  const tweets = require("../blobs/KeywordAxiosFedez.json")

  const list = shallow(<TweetList tweets={tweets} stream={false} />);

  expect(list).toMatchSnapshot();
});

test("check if the component renders correctly using stored blobs --- stream", async () => {
  const streamTweets = require("../blobs/TweetListStreamingCovid.json")

  const list = shallow(<TweetList tweets={streamTweets} stream={true} />);

  expect(list).toMatchSnapshot();
});