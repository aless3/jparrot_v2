import React from "react";
import StreamingTweet from "./StreamingTweet";

const Streaming = () => {
  return (
    <div>
      <br />
      <h2 style={{ textAlign: "center", color: "white" }}>Streaming</h2>
      <br />
      <div className='d-flex justify-content-center text-light mb-3'>
        <h6 className='d-flex align-items-center flex-column'>
          Write the keywords you want to stream separated by a space
          <span className='mb-3'>(e.g. covid america)</span>
          Once you stop the stream, a graph with the frequency of the most
          popular words will appear
        </h6>
      </div>
      <StreamingTweet />
    </div>
  );
};

export default Streaming;
