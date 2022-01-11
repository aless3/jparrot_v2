const {
    TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const competitionClient = appOnlyClient.readOnly;

const router = express.Router();

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function buildQuery(hashtag, correctAnswer = null) {
    let query = "#competition #jparrot_v2 #uniboswe2021 is:reply ";
    // build the no-answer query
    query = query.concat(hashtag)

    if(!correctAnswer){
        return query
    }

    // add a white space after the hashtag
    query = query.concat(' ')
    query = query.concat(correctAnswer)

    return query;
}

async function searchReplies(req, client = competitionClient){
    let hashtag = req.query.hashtag;
    // hashtag cannot have white spaces
    if(hasWhiteSpace(hashtag)){
        return undefined;
    }
    // if it is not a real hashtag, make it one adding the # symbol at the beginning
    if(hashtag.charAt(0) !== '#'){
        hashtag = '#'.concat(hashtag)
    }

    // if correctAnswer is set, use it, else undefined
    let correctAnswer;
    try {
        correctAnswer = req.query.correctAnswer;
    } catch (e) {
        correctAnswer = undefined;
    }

    let max_results;
    // if max_results is set, use it, else use 200 as default
    try {
        max_results = req.query.max_results;
    } catch (e) {
        max_results = 100;
    }

    try {

        let query = buildQuery(hashtag, correctAnswer);

        const search = await client.v2.search(query, {
            expansions: ["author_id"],
            "tweet.fields": ["created_at", "public_metrics", "text"],
            "user.fields": ["username", "name", "profile_image_url"],
            max_results: max_results,
        });


        // fetchLast twice to have all results
        await search.fetchLast(max_results * 2);

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

function containsWrongsAnswers(text, wrongAnswers = []) {
    for (const wrongAnswer of wrongAnswers) {
        try {
            if(text.includes(wrongAnswer)){
                return true
            }
        }catch (e) {
            return true
        }
    }
    return false
}

function extractIndices(replies, listIndices){
    let result = {}
    result.data = []

    result.includes = {}
    result.includes.users = []

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
        if(!result.includes.users.includes(user)){
            result.includes.users.push(user)
        }
    }

    return result
}

function organizeAnswers(replies, wrongAnswers = []) {
    let isWrongArray = Array.isArray(wrongAnswers)

    if(!isWrongArray){
        return undefined;
    }

    try {

        let lists = {};
        lists.listLikes = [-1, -1, -1, -1];
        lists.listIndices = [-1, -1, -1, -1];

        for (let i = 0; i < replies.data.length; i++) {
            let reply = {};
            reply.value = (new Date(replies.data[i].created_at)).getTime();
            reply.index = i;

            lists = updateLists(lists, reply)
        }

        let listIndices = lists.listIndices.reverse();

        return extractIndices(replies, listIndices)
    } catch (e) {
        console.log(e)
        return undefined;
    }
}

function organizeCompetition(replies){
    try {
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

        return extractIndices(replies, listIndices)
    }catch (e) {
        console.log(e)
        return undefined;
    }
}

function organizeReplies(replies, wrongAnswers = []) {
    let errorResult = {}
    errorResult.data = []

    errorResult.includes = {}
    errorResult.includes.users = []

    if(!replies || !replies.meta || replies.meta.result_count === 0){
        return errorResult;
    }

    try {
        let result;
        if(wrongAnswers === []){
            result = organizeCompetition(replies)
        }else {
            result = organizeAnswers(replies, wrongAnswers)
        }
        if(!result){
            result = errorResult
        }

        return result
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

module.exports = { router, searchReplies, organizeReplies, organizeCompetition, organizeAnswers, hasWhiteSpace, updateLists, containsWrongsAnswers, buildQuery, extractIndices };
