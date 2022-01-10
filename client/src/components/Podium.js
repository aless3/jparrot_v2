import React from "react";
import PodiumPlace from "./PodiumPlace";
import Tweet from "./Tweet";
import "./Podium.css";

const Podium = ({ tweets }) => {
  return (
    <>
      <div style={{ marginTop: "5rem" }} className='podium-container'>
        {tweets && tweets.data[1] && (
          <PodiumPlace
            tweet={tweets.data[1]}
            user={
              tweets.includes.users.filter(
                (user) => user.id === tweets.data[1].author_id
              )[0]
            }
            place={2}
            height={18}
          />
        )}
        {tweets && tweets.data[0] && (
          <PodiumPlace
            tweet={tweets.data[0]}
            user={
              tweets.includes.users.filter(
                (user) => user.id === tweets.data[0].author_id
              )[0]
            }
            place={1}
            height={23}
          />
        )}
        {tweets && tweets.data[2] && (
          <PodiumPlace
            tweet={tweets.data[2]}
            user={
              tweets.includes.users.filter(
                (user) => user.id === tweets.data[2].author_id
              )[0]
            }
            place={3}
            height={13}
          />
        )}
      </div>
      {tweets && tweets.data[3] && (
        <div className='honor-mention'>
          <h2 className='honor-title'> Honorable mention</h2>
          <Tweet
            tweet={tweets.data[3]}
            user={
              tweets.includes.users.filter(
                (user) => user.id === tweets.data[3].author_id
              )[0]
            }
          />
        </div>
      )}
    </>
  );
};

export default Podium;
