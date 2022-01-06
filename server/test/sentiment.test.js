const sentiment = require("../routes/sentiment.js");

require("dotenv").config();
const {
    TwitterApi
} = require("twitter-api-v2");

const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

jest.setTimeout(15000);

test('check if getRecentTweetsCount can access the info needed', async () => {
    let req = {};
    req.query = {};
    req.query.keyword = "covid";

    let expected = {};
    expected.data = expect.any(Array);

    let counts = await sentiment.searchCounts(req, client);

    expect(counts.positiveTweets).toStrictEqual(
        expect.objectContaining(expected)
    );

    expect(counts.negativeTweets).toStrictEqual(
        expect.objectContaining(expected)
    );

    expect(counts.totalTweets).toStrictEqual(
        expect.objectContaining(expected)
    );

});

test('check if sentimentCount computes the data obtained by getRecentTweetsCount', async () => {
    let req = {};
    req.query = {};
    req.query.keyword = "covid";

    let expected = {};
    expected.days = expect.any(Array);
    expected.positiveCount = expect.any(Number);
    expected.negativeCount = expect.any(Number);
    expected.sentimentCount = expect.any(Number);
    expected.totalCount = expect.any(Number);
    expected.sentiment = expect.any(Number);
    expected.sentimentName = expect.any(String);

    let counts = await sentiment.searchCounts(req, client);
    let result = await sentiment.sentimentCount(counts);
    expect(result).toStrictEqual(
        expect.objectContaining(expected)
    );
})

test('check sentimentCount computes the data correctly using stored blobs', async () => {
    const file1Input = require('../blobs/sentimentCount_covid_input.json');
    const file2Input = require('../blobs/sentimentCount_fedez_input.json');


    const file1ExpectedOutput = require('../blobs/sentimentCount_covid_output.json');
    const file2ExpectedOutput = require('../blobs/sentimentCount_fedez_output.json');

    let file1RealOutput = await sentiment.sentimentCount(file1Input);
    let file2RealOutput = await sentiment.sentimentCount(file2Input);

    expect(file1RealOutput).toEqual(file1ExpectedOutput);
    expect(file2RealOutput).toEqual(file2ExpectedOutput);
});