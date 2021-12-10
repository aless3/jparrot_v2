const {
    TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

// async function sentimentAnalysis(keyword) {
//     let numTweets = 20;
//     let numPos = 0;
//     let numNeg = 0;
//
//
//     let posTweets = (await client.v2.search(
//         `${keyword} positive`,
//         {
//             "tweet.fields": ["created_at"],
//             max_results: numTweets,
//         }
//     )).data.data;
//
//     if (posTweets !== undefined) {
//         numPos = posTweets.length;
//     }
//
//     let negTweets = (await client.v2.search(
//         `${keyword} negative`,
//         {
//             "tweet.fields": ["created_at"],
//             max_results: numTweets,
//         }
//     )).data.data;
//
//     if (negTweets !== undefined) {
//         numNeg = negTweets.length;
//     }
//
//     let result;
//
//     if (numPos < numTweets && numNeg < numTweets) { // too few tweets, analyze them this way
//         if (numPos === 0 && numNeg === 0) { // absolutely no data
//             result = 0;
//             // console.log("no data");
//         } else if (numPos > numNeg) { // more positive than negative data
//             if (numNeg === 0) { // no negative data, max value
//                 result = 7;
//                 // console.log("no neg data");
//             } else { // very few negative data
//                 result = numPos / numNeg; // the result may exceed the range -7 to +7, we cap it later
//                 // console.log("very few neg data");
//             }
//         } else if (numPos < numNeg) { // more negative than negative data
//             if (numPos === 0) { // no positive data, min value
//                 result = -7;
//                 // console.log("no pos data");
//             } else { // very few positive data
//                 result = numNeg / numPos * -1; // the result may exceed the range -7 to +7, we cap it later
//                 // console.log("very few pos data");
//             }
//         } else { // equal negative and positive, but very small sample
//             result = 0;
//             // console.log("same data");
//         }
//     } else { // yay tweets, analyze them this way
//         let today = new Date();
//         let sevenDaysAgo = new Date(today.getDate() - 7); // min date of a tweet: a week ago
//
//         let lastPosTweet = posTweets.at(-1);
//         let lastPos = new Date(lastPosTweet.created_at);
//
//         let lastNegTweet = negTweets.at(-1);
//         let lastNeg = new Date(lastNegTweet.created_at);
//
//         if (posTweets < numTweets) { // very few positive tweets: we cap the date at the min
//             lastPos = sevenDaysAgo;
//         }
//
//         if (negTweets < numTweets) { // very few negative tweets: we cap the date at the min
//             lastNeg = sevenDaysAgo;
//         }
//
//         let diffTime = Math.abs(lastPos - lastNeg);
//
//         let diff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//
//         // console.log("diff days: ".concat(diff.toString()));
//
//
//         if (diff === 0 && lastPos !== sevenDaysAgo && lastNeg !== sevenDaysAgo) { // so much tweets! check difference between hours instead of days
//             let diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//             diff = diffHours * 7 / 24; // map it between -7 and +7 instead of -24 and +24 (hours in a day) to keep consistency
//
//             // console.log("diff hours: ".concat(diff.toString()));
//
//             if (diff === 0) { // super hot topic! check difference between minutes instead of days or hours
//                 let diffMinutes = Math.floor(diffTime / (1000 * 60));
//                 diff = diffMinutes * 7 / 60; // map it between -7 and +7 instead of -60 and +60 (minutes in an hour) to keep consistency
//
//                 // console.log("diff minutes: ".concat(diff.toString()));
//             }
//         }
//
//         result = diff;
//         // we used the Math.abs earlier, we set it to negative if the negative tweet is the most recent
//         if (lastPos < lastNeg) { // the more recent the better
//             result = result * -1;
//         }
//     }
//
//     // cap result between -7 and +7 if it exceeds those values
//     if (result > 7) {
//         result = 7;
//     } else if (result < -7) {
//         result = -7;
//     }
//
//     return (result);
// }

async function sentimentCount(keyword){
    let positiveTweets = await client.v2.tweetCountRecent(
        `${keyword} (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible)`,
        {"granularity": "day"}
    );

    let negativeTweets = await client.v2.tweetCountRecent(
        `${keyword} (horrible OR worst OR sucks OR bad OR disappointing)`,
        {"granularity": "day"}
    );

    let totalTweets = await client.v2.tweetCountRecent(
        `${keyword}`,
        {"granularity": "day"}
    );

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
    result.totalCount = totCount;

    // sentiment is a value in the range -2 -> +2, below is a table for calculating it

    /*
    pos %   ->  val
    90-00   ->  +2
    67-89   ->  +1
    33-66   ->  +0
    10-32   ->  -1
    00-09   ->  -2
     */

    let sentiment;
    let sentimentName;

    let posPercentage = 100 * posCount / (posCount + negCount);
    if(posPercentage > 90){
        sentiment = 2;
        sentimentName = "Very Positive";
    }else if(posPercentage > 67){
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

    return (result) ;
}

router.get("/", async (req, res) => {
    let keyword = req.query.keyword;

    let result = await sentimentCount(keyword);

    console.log(result);

    res.send(result);

});

module.exports = router;
