import React, { useState } from "react";
import "../App.css";
import axios from "axios";

import TweetList from "./TweetList";

function CompetitionFrontEnd (){

    const [hashtag, setHashtag] = useState("");
    const [maxResults, setMaxResults] = useState(50);

    const [tweets, setTweets] = useState([]);
    const [showTweets, setShowTweets] = useState(false);

    async function searchCompetitors () {
        try {
            let result = await axios.get("http://localhost:8000/competition", {
                params: {
                    hashtag,
                    maxResults
                },
            });

            if(result.data !== undefined){
                setTweets(() => {
                    return result.data;
                });

                setShowTweets(true);
            }else {
                console.log("data is undefined");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const setMaxResultsHandler = (max) => {
        let number = parseInt(max);
        if(!isNaN(number)){
            setMaxResults(number)
        }
    }

    return (
        <div className='container'>
            <div className='label'>Insert keyword</div>
            <input
                type='text'
                value={hashtag}
                onChange={(e) => {
                    setHashtag(e.target.value);
                }}
            />

            <input
                type='text'
                value={maxResults}
                onChange={(e) => {
                    setMaxResultsHandler(e.target.value);
                }}
            />

            <button onClick={searchCompetitors}>Search</button>


            {showTweets &&
                <div className={'searchedView'}>
                    <div className='tweets'>
                        <TweetList tweets={tweets} stream={false} />
                    </div>

                </div>
            }

        </div>
    );

}

export default CompetitionFrontEnd;