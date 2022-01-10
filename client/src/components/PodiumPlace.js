import React from "react";
import Tweet from "./Tweet";
import "./PodiumPlace.css";

const PodiumPlace = ({ place, user, tweet, height }) => {
  let color = "";
  switch (place) {
    case 1:
      color = "#80ccff";
      break;

    case 2:
      color = "#33adff";
      break;
    case 3:
      color = "#007acc";
      break;
    default:
      break;
  }
  return (
    <div className='podium-element'>
      <div className='tweet-container'>
        <Tweet user={user} tweet={tweet} />
      </div>
      <div
        style={{ height: `${height}rem`, backgroundColor: `${color}` }}
        className='pedestal'
      >
        <h1>#{place}</h1>
      </div>
    </div>
  );
};

export default PodiumPlace;
