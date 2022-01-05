import React from "react";
import "../App.css";

import Tweet from "./Tweet";

export class ShowTweets extends React.Component {
    render() {
        let tweets = this.props.tweets;
        let users = this.props.users;

        return(
            <div className='tweet-list'>
                {tweets.map((tweet) => {
                    try {
                        const user = users.filter((u) => u.id === tweet.author_id);
                        return (<Tweet key={tweet.id} user={user[0]} tweet={tweet} />);
                    }catch (e) {
                        return null
                    }

                })}
            </div>
        );
    }
}