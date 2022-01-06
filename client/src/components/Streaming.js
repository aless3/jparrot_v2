import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  FaRetweet,
  FaReply,
  FaHeart,
  FaQuoteRight,
  FaCalendar,
} from "react-icons/fa";
import StreamingTweet from "./StreamingTweet";
import "./Tweet.css";

const Streaming = () => {
    return(
      <div>
            <h2 style={{textAlign: "center", color: "white"}}>Streaming</h2>
            <StreamingTweet></StreamingTweet>
      </div>
    )
  }

export default Streaming;
