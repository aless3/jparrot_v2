const maps = require("../routes/maps.js");

require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

test("check searchMap get the correct data form without time limits", async () => {
  let req = {};
  req.query = {};
  req.query.range = 40000;
  req.query.keyword = "covid";

  let coords = {};
  coords.lat = 44.504953416626705;
  coords.lng = 11.317804500531713;
  req.query.position = JSON.stringify(coords);

  let search = await maps.searchGeo(req, client);

  for (let datum of search.data) {
    expect(datum).toStrictEqual(
      expect.objectContaining({
        text: expect.any(String),
        created_at: expect.any(String),
        author_id: expect.any(String),
        id: expect.any(String),
        geo: expect.any(Object),
        public_metrics: expect.any(Object),
      })
    );
  }
});

test("check searchMap get the correct data form with time limits", async () => {
    let req = {};
    req.query = {};
    req.query.range = 40000;
    req.query.keyword = "covid";
    req.query.start = "2021-10-04T19:24:42Z";
    req.query.end = "2022-01-12T20:24:42Z";

    let coords = {};
    coords.lat = 44.504953416626705;
    coords.lng = 11.317804500531713;
    req.query.position = JSON.stringify(coords);

    let search = await maps.searchGeo(req, client);

    let start_time = new Date(req.query.start)
    let end_time = new Date(req.query.end)

    for (let datum of search.data) {
        expect(datum).toStrictEqual(
            expect.objectContaining({
                text: expect.any(String),
                created_at: expect.any(String),
                author_id: expect.any(String),
                id: expect.any(String),
                geo: expect.any(Object),
                public_metrics: expect.any(Object),
            })
        );

        let date = new Date(datum.created_at)
        expect(date.getTime()).toBeGreaterThanOrEqual(start_time.getTime())
        expect(date.getTime()).toBeLessThanOrEqual(end_time.getTime())
    }
});