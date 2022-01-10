import React from "react";
import Podium from "../src/components/Podium";
import { shallow } from "enzyme";

const tweet = require("../blobs/SingleTweet.json");
const author = require("../blobs/SingleAuthor.json");

test("check if PodiumPlace renders correctly using stored blobs", async () => {
    let tweets = {
        data: [tweet, tweet, tweet],
        includes: {
            users: [author]
        }
    }

    const podium = shallow(<Podium tweets={tweets}/>);

    expect(podium).toMatchSnapshot();
});
