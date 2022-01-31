/**@module maps */
const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const mapsClient = appOnlyClient.readOnly;

const router = express.Router();

/**
 * @function
 * @name searchGeo
 * @description - Funzione di ricerca geolocalizzata
 * Cerca i tweet provenienti da una specifica area geografica, entro un certo periodo di tempo e contenente delle keyword
 * @async
 * @param  req - Contiene i a posizione geografica, il periodo temporale e la keyword da usare come filtro
 * @param  client - Il client da usare [opzionale, se non presente usa streamingClient]
 * @returns - I tweet ottenuti dalla ricerca
 */
async function searchGeo(req, client = mapsClient) {
  const range = req.query.range;
  const coords = JSON.parse(req.query.position);
  const keyword = req.query.keyword;
  const start = req.query.start;
  const end = req.query.end;

  const query = `${keyword} point_radius:[${coords.lng} ${coords.lat} ${
    range / 1000
  }km] has:geo`;
  try {
    let res = await client.v2.searchAll(query, {
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "public_metrics", "text", "geo"],
      "user.fields": ["username", "name", "profile_image_url"],
      max_results: 500,
      ...(start ? { start_time: start } : {}),
      ...(end ? { end_time: end } : {}),
    });

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
