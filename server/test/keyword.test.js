const keyword = require("../routes/keyword.js");

require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

describe("keyword Tests", () => {
  test("check searchKeyword get the correct data form", async () => {
    let req = {};
    req.query = {};
    req.query.keyword = "covid";

    let coords = {};
    coords.lat = 44.504953416626705;
    coords.lng = 11.317804500531713;
    req.query.position = JSON.stringify(coords);

    let search = await keyword.searchKeyword(req, client);

    for (let datum of search.data) {
      expect(datum).toStrictEqual(
        expect.objectContaining({
          text: expect.any(String),
          created_at: expect.any(String),
          author_id: expect.any(String),
          id: expect.any(String),
          public_metrics: expect.any(Object),
        })
      );
    }
  });

  test("check error case for searchKeyword", async () => {
    const result = await keyword.searchKeyword({ query: "" });
    expect(result).toBeFalsy();
  });
});
