import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Tweet from "../src/components/Tweet";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("check if contains the correct informations", () => {
  let user = {
    name: "luca",
    username: "cane",
    profile_image_url: "",
  };

  let tweet = {
    created_at: "2021-09-15T23:05.0",
    text: "god i dead",
    public_metrics: {
      like_count: "12",
      quote_count: "36",
      reply_count: "50",
      retweet_count: "125",
    },
  };

  act(() => {
    render(<Tweet user={user} tweet={tweet} />, container);
  });

  expect(container.querySelector(".name").textContent).toBe("luca");
  expect(container.querySelector(".username").textContent).toBe("@cane");
  expect(container.querySelector(".text").textContent).toBe("god i dead");
  expect(container.querySelector(".reply").textContent).toBe("50");
  expect(container.querySelector(".like").textContent).toBe("12");
  expect(container.querySelector(".retweet").textContent).toBe("125");
  expect(container.querySelector(".quote").textContent).toBe("36");
  expect(container.querySelector(".date").textContent).toBe("2021-09-1523:05");
});

test("if tweet === null, return null", () => {
  let user = {
    name: "luca",
    username: "cane",
    profile_image_url: "",
  };

  act(() => {
    render(<Tweet user={user} tweet={undefined} />, container);
  });
  expect(container.querySelector(".name")).toBeFalsy();
});

test("if user === null, return null", () => {
  let tweet = {
    created_at: "2021-09-15T23:05.0",
    text: "god i dead",
    public_metrics: {
      like_count: "12",
      quote_count: "36",
      reply_count: "50",
      retweet_count: "125",
    },
  };

  act(() => {
    render(<Tweet user={undefined} tweet={tweet} />, container);
  });
  expect(container.querySelector(".name")).toBeFalsy();
});