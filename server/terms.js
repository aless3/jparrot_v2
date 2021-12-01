const {
  ETwitterStreamEvent,
  TweetStream,
  TwitterApi,
  ETwitterApiError,
} = require("twitter-api-v2");
const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5"
);
const client = appOnlyClient.readOnly;

const app = express();
app.use(cors());
const server = http.createServer(app);

app.get("/terms", async (req, res) => {


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
      if(trend.tweet_volume > 1) {
        count = trend.tweet_volume;
      }

      let item = {value: trend.name, count: count};
      // item.value = trend.name;
      // item.key = trend.name;
      // item.count = count;

      console.log(item);


      r.push(item);
    }
  }

  // const trendsOfCoords = await client.v1.trendsClosest(coords.lat, coords.lng);
  //
  // trendsOfCoords;
  //
  //
  // for (const trends of trendsOfCoords) {
  //   for (const trend of trends) {
  //     console.log('Trend: ', trend.name, ' count: ', trend.tweet_volume);
  //     r.set(trend.name, trend.tweet_volume);
  //   }
  // }
  //
  // for (const { name, tweet_volume } of trendsOfCoords) {
  //   console.log('Trend ', name, 'has count: ', tweet_volume);
  // }
  //

  res.send(r);
});

server.listen(8000, console.log("listening on 8000"));
