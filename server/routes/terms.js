const {
  ETwitterStreamEvent,
  TweetStream,
  TwitterApi,
  ETwitterApiError,
} = require("twitter-api-v2");

const path = require("path");
const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

var router = express.Router();

router.use(cors());

router.get("/", async (req, res) => {
  const coords = JSON.parse(req.query.position);

  let r = [];
  //
  // const { result } = await client.v1.geoReverseGeoCode({ lat: 1.329, long: -13.3 });
  //
  // for (const place of result.places) {
  //   console.log(place); // PlaceV1
  // }
  //

  // console.log(places.);

  // const trendsOfPlace = await client.v1.trendsByPlace(places);
  let place = (await client.v1.trendsClosest(1.329, -13.3)).pop().woeid;
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
