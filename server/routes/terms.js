/**@module terms */
const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const termsClient = appOnlyClient.readOnly;

const router = express.Router();

/**
 * @function
 * @name organizeTrendsOfPlace
 * @description - Funzione di ordinamento delle tendenze.
 * Prende un array di oggetti e li prepara come array contenenti nome di un trend e numero di occorrenze
 * @param trendsOfPlace - Array di oggetti contenenti nome di un trend e numero di occorrenza, ma non ordinato
 * @returns - Array di oggetti ordinati in base al numero di occorrenze
 */
function organizeTrendsOfPlace(trendsOfPlace) {
  let r = [];

  if (trendsOfPlace === undefined) {
    return r;
  }

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

/**
 * @function
 * @name searchTerms
 * @description - Funzioen di ricerca delle tendenze.
 * Prende un oggetto request contenente delle coordinate e cerca le tendenze attorno al quel luogo
 * @param req - L'oggetto request contenente le coordinate
 * @param  client - Il client da usare [opzionale, se non presente usa streamingClient]
 * @returns - Un array di oggetti contenenti il trend e  ordinati in base alla tendenza
 */
async function searchTerms(req, client = termsClient) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  let trendsOfPlace = undefined;
  try {
    let place = (await client.v1.trendsClosest(latitude, longitude)).pop()
      .woeid;
    trendsOfPlace = client.v1.trendsByPlace(place);
  } catch (e) {
    console.error(e);
  }
  return trendsOfPlace;
}

router.get("/", async (req, res) => {
  let trendsOfPlace = await searchTerms(req);
  let result = organizeTrendsOfPlace(trendsOfPlace);
  res.send(result);
});

module.exports = { router, organizeTrendsOfPlace, searchTerms };
