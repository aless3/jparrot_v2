import React from "react";
import StreamingTweet from "./StreamingTweet";
import "./Tweet.css";

const Streaming = () => {
    return(
      <div> 
            <br />
            <h2 style={{textAlign: "center", color: "white"}}>Streaming</h2>
            <br />
            <StreamingTweet/>
      </div>
    )
  }

export default Streaming;
