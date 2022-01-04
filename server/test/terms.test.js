const terms = require("../routes/terms.js");
require("dotenv").config();
const {
    TwitterApi
} = require("twitter-api-v2");

const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

test('check organizeTrendsOfPlace computes the data correctly', () => {
    const input = require('../blobs/organizeTrendsOfPlace_input.json');
    const expectedOutput = require('../blobs/organizeTrendsOfPlace_output.json');

    let realOutput = terms.organizeTrendsOfPlace(input);

    expect(realOutput).toEqual(expectedOutput);
});

test('check searchTerms returns an object usable by organizeTrendsOfPlace', async () => {
    let req = {};
    req.query = {};
    req.query.latitude = 12;
    req.query.longitude = 12;

    let trendsOfPlace = await terms.searchTerms(req, client);

    let expected = {};
    expected.name = expect.any(String);
    expected.tweet_volume = expect.any(Number);

    for (const { trends } of trendsOfPlace) {
        for (const trend of trends) {
            if (trend.tweet_volume > 1) {
                expect(trend).toStrictEqual(expect.objectContaining(expected));
            }
        }
    }
});
