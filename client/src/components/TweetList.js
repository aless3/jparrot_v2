import React from "react";
import Tweet from "./Tweet";

import "./TweetList.css";

const TweetList = ({ tweets, stream }) => {
  return (
    <div className='tweet-list'>
      {stream
        ? tweets.map((tweet) => {
            return (
              <Tweet
                key={tweet.data.id}
                user={tweet.includes.users[0]}
                tweet={tweet.data}
                stream={stream}
              />
            );
          })
        : tweets.data.map((tweet) => {
            const user = tweets.includes.users.filter(
              (u) => u.id === tweet.author_id
            );
            return (
              <Tweet
                key={tweet.id}
                user={user[0]}
                tweet={tweet}
                stream={stream}
              />
            );
          })}
    </div>
  );
};

export default TweetList;
