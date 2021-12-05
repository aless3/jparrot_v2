const {
  TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

router.get("/", async (req, res) => {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  console.log("lat");
  console.log("lat");
  console.log("lat");
  console.log("lat");
  console.log("lat");
  console.log("lat");
  console.log(req.query);
  console.log("lat");
  console.log("lat");
  console.log("lat");

  let r = [];

  let place = (await client.v1.trendsClosest(latitude, longitude)).pop().woeid;
  let trendsOfPlace = await client.v1.trendsByPlace(place);

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
  res.send(r);
});

module.exports = router;
