import React from 'react';
import StreamingTweet from '../src/components/StreamingTweet';
import { shallow } from "enzyme";

test('check if StreamingTweet shows that it is trying to show the tweets stream', async () => {
    const streaming = shallow(<StreamingTweet />);

    expect(streaming.text()).toEqual(
        expect.not.stringContaining("Sto cercando i tweet")
    )

    let startButton = streaming.find('Button').at(0)
    let endButton = streaming.find('Button').at(1)

    // start
    startButton.simulate('click')

    expect(streaming.text()).toEqual(
        expect.stringContaining("Sto cercando i tweet")
    )


    // end
    endButton.simulate('click')

    expect(streaming.text()).toEqual(
        expect.not.stringContaining("Sto cercando i tweet")
    )
});