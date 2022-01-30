import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StreamingTweet from "../src/components/StreamingTweet";
import { shallow } from "enzyme";

jest.mock("socket.io-client");
import io from "socket.io-client";
import MockedSocket from "socket.io-mock";

test("check if can connect and disconnect", async () => {
  let socket;
  socket = new MockedSocket();
  socket.disconnect = jest.fn();
  socket.id = 42;
  socket.on = jest.fn();
  io.mockReturnValue(socket);

  // const streaming = shallow(<StreamingTweet />);
  render(<StreamingTweet />);

  let text = "covid";

  // let form = streaming.find("FormControl").at(0);
  let form = screen.getByTestId("input");
  // let startButton = streaming.find("Button").at(0);
  let startButton = screen.getByTestId("startButton");
  // let endButton = streaming.find("Button").at(1);
  let endButton = screen.getByTestId("stopButton");

  // set an input
  let textObj = {
    target: {
      value: text,
    },
  };
  // form.simulate("change", textObj);
  fireEvent.change(form, textObj);
  // start
  socket.on("start-stream", (data) => {
    expect(data).toEqual(text);
    done();
  });
  // startButton.simulate("click");
  fireEvent.click(startButton);

  socket.socketClient.emit("connect");
  expect(io.connect).toHaveBeenCalled();

  // end
  socket.on("end-stream", () => {
    expect(socket.disconnect).toHaveBeenCalled();
    done();
  });
  // endButton.simulate("click");
  fireEvent.click(endButton);
});

test("check if StreamingTweet shows that it is trying to show the tweets stream", async () => {
  // const streaming = shallow(<StreamingTweet />);
  render(<StreamingTweet />);

  // expect(document.querySelector("body")).toEqual(
  //   expect.not.stringContaining("Sto cercando i tweet")
  // );

  expect(document.querySelector("#searching")).toBeNull();

  // let startButton = streaming.find("Button").at(0);
  let startButton = screen.getByTestId("startButton");
  // let endButton = streaming.find("Button").at(1);
  let endButton = screen.getByTestId("stopButton");

  fireEvent.change(screen.getByTestId("input"), {
    target: { value: "bonini" },
  });

  // start
  // startButton.simulate("click");
  fireEvent.click(startButton);

  // expect(document.querySelector("body")).toEqual(
  //   expect.stringContaining("Sto cercando i tweet")
  // );

  expect(document.querySelector("#searching").innerHTML).toBe(
    "Looking for Tweets..."
  );

  // end
  // endButton.simulate("click");
  fireEvent.click(endButton);

  // expect(document.querySelector("body")).toEqual(
  //   expect.not.stringContaining("Sto cercando i tweet")
  // );

  expect(document.querySelector("#searching")).toBe(null);
});

test("show error if no input", () => {
  render(<StreamingTweet />);

  fireEvent.click(screen.getByTestId("startButton"));

  expect(document.querySelector("#errorMsg").innerHTML).toBe(
    "No keywords entered!"
  );
});
