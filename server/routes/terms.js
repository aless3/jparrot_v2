const {
  TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const termsClient = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

function organizeTrendsOfPlace(trendsOfPlace){
  let r = [];

  for (const { trends } of trendsOfPlace) {
    for (const trend of trends) {
      let count = 1;
      // if volume is not null set count
      if (trend.tweet_volume > 1) {
        count = trend.tweet_volume;
        let item = { value: trend.name, count: count };
        r.push(item);
      }
    }
  }

  return r;
}

async function searchTerms(req, client = termsClient) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  let place = (await client.v1.trendsClosest(latitude, longitude)).pop().woeid;
  return client.v1.trendsByPlace(place);
}

router.get("/", async (req, res) => {
  let trendsOfPlace = await searchTerms(req);
  let result = organizeTrendsOfPlace(trendsOfPlace)
  res.send(result);
});

module.exports = { router, organizeTrendsOfPlace, searchTerms };
