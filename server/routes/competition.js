const {
    TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const competitionClient = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

async function searchReplies(req, client = competitionClient){
    let baseQuery = "#competition #competitor #jparrot_v2 #uniboswe2021 is:reply ";
    let max_results;

    // if max_results is set, use it, else use 200 as default
    try {
        max_results = req.query.max_results;
    } catch (e) {
        max_results = 50;
    }

    try {
        let hashtag = req.query.hashtag;

        // cannot have white spaces
        if(hasWhiteSpace(hashtag)){
            return undefined;
        }

        // if it is not a hashtag, make it one adding the # symbol at the beginning
        if(hashtag.charAt(0) !== '#'){
            hashtag = '#'.concat(hashtag)
        }

        // build the correct query
        let query = baseQuery;
        query = query.concat(hashtag)

        const search = await client.v2.search(query, {
            expansions: ["author_id"],
            "tweet.fields": ["created_at", "public_metrics", "text"],
            "user.fields": ["username", "name", "profile_image_url"],
            max_results: max_results,
        });


        // fetchLast twice to have all results
        await search.fetchLast(max_results * 10);


        return search.data;
    } catch (e) {
        console.log(e);
    }

    return undefined
}

function updateLists(lists, newItem) {
    let list = lists.listLikes;
    let indices = lists.listIndices;

    let value = newItem.value;
    let index = newItem.index;

    for (let i = 0; i < list.length; i++) {
        if(value > list[i]){

            let resultList = list.slice(0, i);
            resultList.push(value);
            resultList.push(...list.slice(i, -1))

            let resultIndices = indices.slice(0, i);
            resultIndices.push(index);
            resultIndices.push(...indices.slice(i, -1));

            let result = {};
            result.listLikes = resultList;
            result.listIndices = resultIndices;

            return result;
        }
    }

    return lists;
}

function organizeReplies(replies) {
    let errorResult = {}
    errorResult.data = []

    errorResult.includes = {}
    errorResult.includes.users = []

    if(replies === undefined || replies.meta === undefined || replies.meta.result_count === 0){
        return undefined;
    }
    try {
        let result = {}
        result.data = []

        result.includes = {}
        result.includes.users = []

        let lists = {};
        lists.listLikes = [-1, -1, -1, -1];
        lists.listIndices = [-1, -1, -1, -1];

        for (let i = 0; i < replies.data.length; i++) {
            let reply = {};
            reply.value = replies.data[i].public_metrics.like_count;
            reply.index = i;

            lists = updateLists(lists, reply)
        }

        let listIndices = lists.listIndices;

        for (const i of listIndices) {
            let tweet = replies.data[i];
            if(tweet === undefined){
                continue;
            }

            let user = replies.includes.users.filter(
                (u) => u.id === tweet.author_id
            );
            user = user[0];

            result.data.push(tweet)
            result.includes.users.push(user)
        }

        return result;
    }catch (e) {
        console.log(e)
        return errorResult;
    }
}


router.get("/", async (req, res) => {
    let replies = await searchReplies(req);
    let result = organizeReplies(replies);
    res.send(result);
});

module.exports = { router, searchReplies, organizeReplies, hasWhiteSpace, updateLists };
