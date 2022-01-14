const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const mapsClient = appOnlyClient.readOnly;

const router = express.Router();

/*
funzione che prende la richiesta, ci tira fuori il range, le coordinate
e la keyword e sputa il campo data della richiesta
*/
async function searchGeo(req, client = mapsClient) {
  const range = req.query.range;
  const coords = JSON.parse(req.query.position);
  const keyword = req.query.keyword;
  const start = req.query.start;
  const end = req.query.end;

  console.log(start)
  console.log(end)


  const query = `${keyword} point_radius:[${coords.lng} ${coords.lat} ${
    range / 1000
  }km] has:geo `;
  try {
    let res = await client.v2.searchAll(query, {
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "public_metrics", "text", "geo"],
      "user.fields": ["username", "name", "profile_image_url"],
      max_results: 500,
      start_time: start,
      end_time: end
    });

    await res.fetchLast(500);
    return res.data;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

router.get("/geo-keyword", async (req, res) => {
  let result = await searchGeo(req);
  res.send(result);
});

module.exports = { router, searchGeo };
