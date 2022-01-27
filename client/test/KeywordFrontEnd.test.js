import React from "react";
import KeywordFrontEnd, { emoijImage } from "../src/components/KeywordFrontEnd";
import { shallow } from "enzyme";

test("check if KeywordFrontEnd correctly creates the graphs with data stored from blobs", async () => {
  const keyword = shallow(<KeywordFrontEnd />);

  let searchButton = keyword.find("Button").at(1);

  searchButton.simulate("click");

  expect(keyword).toMatchSnapshot();
});

test("check if KeywordFrontEnd correctly creates correctly the term cloud", async () => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3,
          },
        })
      )
    ),
  };

  const keyword = shallow(<KeywordFrontEnd />);

  expect(keyword).toMatchSnapshot();
});

test("check if KeywordFrontEnd does not create the term cloud on error", async () => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success, error) =>
      Promise.resolve(
        error({
          code: 1,
          message: "GeoLocation Error",
        })
      )
    ),
  };

  const keyword = shallow(<KeywordFrontEnd />);

  expect(keyword).toMatchSnapshot();
});

test("check if KeywordFrontEnd correctly reacts to user inputs", async () => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3,
          },
        })
      )
    ),
  };

  const keyword = shallow(<KeywordFrontEnd />);

  let buttons = keyword.find("Button");

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons.at(i);
    button.simulate("click");
    expect(keyword).toMatchSnapshot();
  }

  for (let i = 2; i < buttons.length; i++) {
    let button = buttons.at(i);
    button.simulate("click");
    expect(keyword).toMatchSnapshot();
  }

  keyword.update();

  expect(keyword).toMatchSnapshot();
});

test("check emoji function", () => {
  const cb = (param) => {
    expect(param).toBe("png");
  };

  for (let i = -2; i < 4; i++) {
    emoijImage(i, cb);
  }
});
