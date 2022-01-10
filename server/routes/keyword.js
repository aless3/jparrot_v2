const {
    TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const keywordClient = appOnlyClient.readOnly;

const router = express.Router();

async function searchKeyword(req, client = keywordClient) {
    let keyword = req.query.keyword;
    try {
        return (await client.v2.search(
            `${keyword}`,
            {
                expansions: ["author_id"],
                "tweet.fields": ["created_at", "public_metrics", "text"],
                "user.fields": ["username", "name", "profile_image_url"],
                max_results: 50,
            }
        )).data;
    }catch (e) {
        console.error(e);
        return undefined;
    }
}

router.get("/", async (req, res) => {
    let result = await searchKeyword(req);
    res.send(result);
});

module.exports = { router, searchKeyword };
