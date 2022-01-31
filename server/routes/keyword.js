/**@module keyword */
const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const keywordClient = appOnlyClient.readOnly;

const router = express.Router();

/**
 * @function
 * @name searchKeyword
 * @description - Funzione che cerca la keyword.
 * Cerca i tweet che contengono la keyword fornita
 * @async
 * @param req - Query proveniente dal front end che contiene la keyword
 * @param  client - Il client da usare [opzionale, se non presente usa streamingClient]
 * @returns - I tweet ottenuti cercando la keyword
 */
async function searchKeyword(req, client = keywordClient) {
  let keyword = req.query.keyword;
  try {
    return (
      await client.v2.searchAll(`${keyword}`, {
        expansions: ["author_id"],
        "tweet.fields": ["created_at", "public_metrics", "text"],
        "user.fields": ["username", "name", "profile_image_url"],
        max_results: 50,
      })
    ).data;
  } catch (e) {
    console.error(e);
    return false;
  }
}

router.get("/", async (req, res) => {
  let result = await searchKeyword(req);
  res.send(result);
});

module.exports = { router, searchKeyword };
