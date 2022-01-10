import React from "react";
import PodiumPlace from "../src/components/PodiumPlace";
import { shallow } from "enzyme";

const tweet = require("../blobs/SingleTweet.json");
const author = require("../blobs/SingleAuthor.json");
const height = 23;

test("check if PodiumPlace renders correctly position 1 using stored blobs", async () => {
    let place = 1;
    const podiumPlace = shallow(<PodiumPlace place={place} tweet={tweet} user={author} height={height}/>);

    expect(podiumPlace).toMatchSnapshot();
});

test("check if PodiumPlace renders correctly position 1 using stored blobs", async () => {
    let place = 2;
    const podiumPlace = shallow(<PodiumPlace place={place} tweet={tweet} user={author} height={height}/>);

    expect(podiumPlace).toMatchSnapshot();
});

test("check if PodiumPlace renders correctly position 1 using stored blobs", async () => {
    let place = 3;
    const podiumPlace = shallow(<PodiumPlace place={place} tweet={tweet} user={author} height={height}/>);

    expect(podiumPlace).toMatchSnapshot();
});