import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { shallow } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import Maps from "../src/components/MapsFrontEnd";
const mapsData = require("../blobs/mapsAxios.json");

jest.mock("axios");
const axios = require("axios");

jest.setTimeout(30000);

import MutationObserver from "mutation-observer";
global.MutationObserver = MutationObserver;

test("correctly show tweets", async () => {
  const mockGeolocation = {
    getCurrentPosition: (success, fail, options) => {
      return { coords: { latitude: 44.494887, longitude: 11.3426163 } };
    },
  };
  global.navigator.geolocation = mockGeolocation;

  render(<Maps />);

  const range = screen.getByTestId("areaSelector");
  const button = screen.getByTestId("searchButton");

  let tweetText;

  axios.get.mockImplementation((url) => {
    let result = {
      data: undefined,
    };

    return {
      data: mapsData,
    };

    return Promise.resolve(result);
  });

  act(() => {
    fireEvent.change(range, { target: { value: "5000" } });
    fireEvent.click(button);
  });
  tweetText = await screen.findAllByText("este123");

  expect(tweetText.length).toBe(2);
});

test("correctly change dates and keyword", () => {
  render(<Maps />);

  const keyword = document.querySelector("#keyword");
  const fromDate = document.querySelector("#fromDate");
  const toDate = document.querySelector("#toDate");
  act(() => {
    fireEvent.change(keyword, { target: { value: "something" } });
    fireEvent.change(fromDate, { target: { value: "2000-01-01" } });
    fireEvent.change(toDate, { target: { value: "2000-01-20" } });
  });
  expect(document.querySelector("#keyword").value).toBe("something");
  expect(document.querySelector("#fromDate").value).toBe("2000-01-01");
  expect(document.querySelector("#toDate").value).toBe("2000-01-20");
});

test("check behaviour in case no tweets are sent", () => {
  render(<Maps />);

  axios.get.mockImplementation((url) => {
    let result = {
      data: undefined,
    };

    return {
      data: { data: undefined },
    };

    return Promise.resolve(result);
  });

  act(() => {
    const button = screen.getByTestId("searchButton");
    fireEvent.click(button);
  });
});
