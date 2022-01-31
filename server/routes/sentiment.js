/** @module sentiment */

/**
 * @typedef {object} Result
 * @property {int} positiveCount - Contatore dei tweet positivi
 * @property {int} negativeCount - Contatore dei tweet negativi
 * @property {int} sentimentCount - (positivi + negativi) contatore tweet
 * @property {int} totalCount - totale dei tweet
 */

/**
 * @typedef {object} SentimentTweets
 * @property {int} positiveCount - Contatore dei tweet positivi
 * @property {int} negativeCount - Contatore dei tweet negativi
 * @property {int} sentimentCount - (positivi + negativi) contatore tweet
 * @property {int} totalCount - totale dei tweet
 */

const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.CORE_BEARER);
const sentimentClient = appOnlyClient.readOnly;

const router = express.Router();

/**
 *  @function
 *  @name searchCounts
 *  @description - Funzione di API Twitter.
 *  Usa la keyword contenuta dentro l'oggetto req e ritorna il numero dei tweet positivi, quelli negativi e anche il totale.
 *  @async
 *  @returns {SentimentTweets} - Ritorna un oggetto SentimentTweets.
 * @param req - L'oggetto richiesta proveniente dal front end
 * @param client - Il client per comunicare con l'API, opzionale da usare solo durante i test
 */
async function searchCounts(req, client = sentimentClient) {
  let keyword = req.query.keyword;

  try {
    let positiveTweets = await client.v2.tweetCountRecent(
      `${keyword} (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible) -horrible -worst -sucks -bad -disappointing`,
      { granularity: "day" }
    );

    let negativeTweets = await client.v2.tweetCountRecent(
      `${keyword} (horrible OR worst OR sucks OR bad OR disappointing) -happy -exciting -excited -favorite -fav -amazing -lovely -incredible`,
      { granularity: "day" }
    );

    let totalTweets = await client.v2.tweetCountRecent(
      `${keyword} -is:retweet`,
      { granularity: "day" }
    );

    let counts = {};
    counts.positiveTweets = positiveTweets;
    counts.negativeTweets = negativeTweets;
    counts.totalTweets = totalTweets;

    return counts;
  } catch (e) {
    console.error(e);
  }

  return undefined;
}

/**
 *  @function
 *  @name sentimentCount
 *  @description - Funzione di analisi del Sentiment.
 *  Prende un array di tweet proveniente dalla ricerca di una keyword e analizza il sentimento globale verso di essa
 *  @async
 *  @param counts - Oggetto contenente 20 tweet per categoria: Tweet positivi, negativi e totali
 *  @returns {Result} - Restituisce un oggetto Result.
 */
async function sentimentCount(counts) {
  if (counts === undefined) {
    return undefined;
  }
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
    day.date = positiveTweets.data[i].start;
    day.pos_count = positiveTweets.data[i].tweet_count;
    day.neg_count = negativeTweets.data[i].tweet_count;
    day.tot_count = totalTweets.data[i].tweet_count;
    result.days.push(day);

    posCount += positiveTweets.data[i].tweet_count;
    negCount += negativeTweets.data[i].tweet_count;
    totCount += totalTweets.data[i].tweet_count;
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

  let posPercentage = (100 * posCount) / (posCount + negCount);
  let zero = posCount === 0 && negCount === 0;

  if (posPercentage > 90) {
    sentiment = 2;
    sentimentName = "Very Positive";
  } else if (posPercentage > 66) {
    sentiment = 1;
    sentimentName = "Positive";
  } else if (posPercentage > 33 || zero) {
    sentiment = 0;
    sentimentName = "Neutral";
  } else if (posPercentage > 10) {
    sentiment = -1;
    sentimentName = "Negative";
  } else {
    sentiment = -2;
    sentimentName = "Very Negative";
  }

  result.sentiment = sentiment;
  result.sentimentName = sentimentName;

  return result;
}

router.get("/", async (req, res) => {
  let counts = await searchCounts(req);
  let result = await sentimentCount(counts);

  res.send(result);
});

module.exports = { router, searchCounts, sentimentCount };
