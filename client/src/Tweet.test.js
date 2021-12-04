import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Tweet from "./Tweet";

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

test("test for Tweet component", () => {
  var user = {
    name: "luca",
    userName: "cane",
    profile_image_url: "",
  };

  var tweet = {
    created_at: "0.0.0T0.0.0",
    text: "god i dead",
    public_metrics: {
      like_count: "12",
      quote_count: "00",
      reply_count: "012",
      retweet_count: "125",
    },
  };

  act(() => {
    render(<Tweet user={user} tweet={tweet} />, container);
  });

  let u = container.getElementbyClass("name");

  expect(u.textContent).toBe("luca");
});
