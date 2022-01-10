import React from "react";
import StreamingTweet from "../src/components/StreamingTweet";
import { shallow } from "enzyme";

jest.mock("socket.io-client");
import io from "socket.io-client";
import MockedSocket from "socket.io-mock";

test("check if can connect and disconnect", async () => {
    let socket;
    socket = new MockedSocket();
    socket.disconnect = jest.fn();
    socket.id = 42
    socket.on = jest.fn()
    io.mockReturnValue(socket);

    const streaming = shallow(<StreamingTweet />);

    let text = "covid";

    let form = streaming.find("FormControl").at(0);
    let startButton = streaming.find("Button").at(0);
    let endButton = streaming.find("Button").at(1);

    // set an input
    let textObj = {
        target: {
            value: text,
        },
    };
    form.simulate("change", textObj);

    // start
    socket.on("start-stream", (data) => {
        expect(data).toEqual(text);
        done();
    });
    startButton.simulate("click");

    socket.socketClient.emit("connect");
    expect(io.connect).toHaveBeenCalled();

    // end
    socket.on("end-stream", () => {
        expect(socket.disconnect).toHaveBeenCalled();
        done();
    });
    endButton.simulate("click");
});

test("check if StreamingTweet shows that it is trying to show the tweets stream", async () => {
    const streaming = shallow(<StreamingTweet />);

    expect(streaming.text()).toEqual(
        expect.not.stringContaining("Sto cercando i tweet")
    );

    let startButton = streaming.find("Button").at(0);
    let endButton = streaming.find("Button").at(1);

    // start
    startButton.simulate("click");

    expect(streaming.text()).toEqual(
        expect.stringContaining("Sto cercando i tweet")
    );

    // end
    endButton.simulate("click");

    expect(streaming.text()).toEqual(
        expect.not.stringContaining("Sto cercando i tweet")
    );
});


test("simulate tweet incoming", async () => {

});