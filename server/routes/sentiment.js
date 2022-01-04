const {
    TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const sentimentClient = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

async function searchCounts(client, req) {
    let keyword = req.query.keyword;

    let positiveTweets = await client.v2.tweetCountRecent(
        `${keyword} (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible) -horrible -worst -sucks -bad -disappointing`,
        {"granularity": "day"}
    );

    let negativeTweets = await client.v2.tweetCountRecent(
        `${keyword} (horrible OR worst OR sucks OR bad OR disappointing) -happy -exciting -excited -favorite -fav -amazing -lovely -incredible`,
        {"granularity": "day"}
    );

    let totalTweets = await client.v2.tweetCountRecent(
        `${keyword} -is:retweet`,
        {"granularity": "day"}
    );

    let counts = {};
    counts.positiveTweets = positiveTweets;
    counts.negativeTweets = negativeTweets;
    counts.totalTweets = totalTweets;

    return counts;
}

async function sentimentCount(counts){
    let positiveTweets = counts.positiveTweets;
    let negativeTweets = counts.negativeTweets;
    let totalTweets = counts.totalTweets;

    const result = {};
    result.days = [];

    let posCount = 0;
    let negCount = 0;
    let totCount = 0;

    for (let i = 0; i < 8; i++) {
        let day = {};
        day.date = positiveTweets.data.at(i).start;
        day.pos_count = positiveTweets.data.at(i).tweet_count;
        day.neg_count = negativeTweets.data.at(i).tweet_count;
        day.tot_count = totalTweets.data.at(i).tweet_count;
        result.days.push(day);


        posCount += positiveTweets.data.at(i).tweet_count;
        negCount += negativeTweets.data.at(i).tweet_count;
        totCount += totalTweets.data.at(i).tweet_count;
    }

    result.positiveCount = posCount;
    result.negativeCount = negCount;
    result.sentimentCount = posCount + negCount;
    result.totalCount = totCount;

    // sentiment is a value in the range -2 -> +2, below is a table for calculating it

    /*
    pos %   ->  val
    90-00   ->  +2
    66-89   ->  +1
    33-65   ->  +0
    10-32   ->  -1
    00-09   ->  -2
     */

    let sentiment;
    let sentimentName;

    let posPercentage = 100 * posCount / (posCount + negCount);
    if(posPercentage > 90){
        sentiment = 2;
        sentimentName = "Very Positive";
    }else if(posPercentage > 66){
        sentiment = 1;
        sentimentName = "Positive";
    }else if(posPercentage > 33){
        sentiment = 0;
        sentimentName = "Neutral";
    }else if(posPercentage > 10){
        sentiment = -1;
        sentimentName = "Negative";
    }else{
        sentiment = -2;
        sentimentName = "Very Negative";
    }

    result.sentiment = sentiment;
    result.sentimentName = sentimentName;

    return result;
}

router.get("/", async (req, res) => {
    let counts = await searchCounts(sentimentClient, req);
    let result = await sentimentCount(counts);
    res.send(result);
});

module.exports = { router, searchCounts, sentimentCount };