const
{
    ETwitterStreamEvent,
    TweetStream,
    TwitterApi,
    ETwitterApiError,
} = require("twitter-api-v2");

const path = require("path");
const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5"
);
const client = appOnlyClient.readOnly;

var router = express.Router();
router.use(cors());

router.get("/geokeyword", async (req, res) => {
  const range = req.query.range;
  const coords = JSON.parse(req.query.position);
  const keyword = req.query.keyword;
  const results = await client.v2.search(
    `${keyword} point_radius:[${coords.lng} ${coords.lat} ${
      range / 1000
    }km] has:geo`,
    {
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "public_metrics", "text", "geo"],
      "user.fields": ["username", "name", "profile_image_url"],
      max_results: 50,
    }
  );
  console.log(results);
  res.send(results.data);
});

modules.export = router
