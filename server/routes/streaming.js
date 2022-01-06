const
    {
        ETwitterStreamEvent,
        TwitterApi
    } = require('twitter-api-v2');

const path = require('path')
const express = require('express')

const appOnlyClient = new TwitterApi(process.env.CORE_BEARER);
const streamingClient = appOnlyClient.readOnly;

const router = express.Router();
let stream;

router.get('/home', (req, res) =>{
    res.sendFile(path.resolve(__dirname, '../index.html'))
})

/**
 *  Rule reset function.
 *  Deletes all set rules.
 *  @async
 *
 */
const resetRules = async (client = streamingClient) => {
    let rules = await client.v2.streamRules()
    if(rules.data?.length){
        await deleteRules(rules.data.map(rule=>rule.id))
    }
}

/**
 *  Rule insertion function.
 *  Add rules passed by argument. (WHAT DOES IT DO WITH ALREADY EXISTING RULES?)
 *  @async
 *  @param rules - the list of rule strings to add to the rules applied for tweets filtering.
 *  @param client - the client to use [optional, if not passed use streamingClient
 */
const setRules = async (rules, client = streamingClient) => {
    if(rules.length > 0) {
        await client.v2.updateStreamRules({
            add: rules.map((keyword)=>{
                return{value: keyword}
            })
        })
        let streamRules = await client.v2.streamRules();
        console.log(streamRules)
    }
}

/**
 *  Rule output function.
 *  Returns all the rules applied for tweets filtering.
 *  @async
 *  @param client - the client to use [optional, if not passed use streamingClient
 *  @returns {Rules} - returns the tweet filtering rules
 */
const getRules = async (client = streamingClient) => {
    return client.v2.streamRules()
}

/**
 *  Rule deletion function.
 *  Delete rules passed by argument, keeps all others.
 *  @async
 *  @param args - the list of rule IDs to remove from the rules applied for tweets filtering.
 *  @param client - the client to use [optional, if not passed use streamingClient
 */
const deleteRules = async (args, client = streamingClient) => {
    if(args.length > 0){
        await client.v2.updateStreamRules({
            delete:{
                ids: args
            }
        })
        console.log('Rules Deleted')
    }
}

let active = false;

/**
 *  Streaming function.
 *  Set rules, starts stream
 *  @async
 *  @param args - the list of rules to set for tweets filtering
 *  @param socket - the io socket to emit data to
 *  @param client - the client to use [optional, if not passed use streamingClient
 */
const startStream = async (args, socket, client = streamingClient) => {
    let i = 0;
    try{
        await resetRules()
        await setRules(args)

    }catch (error){
        console.log('FROM RESET-AND-SET ')
        console.log(error)
    }

    try{
        stream = await client.v2.searchStream({
            expansions: ["author_id"],
            "tweet.fields": ["created_at", "text"],
            "user.fields": ["username", "name", "profile_image_url"],
        })
        active = true;
        stream.autoReconnect = true
        stream.on(ETwitterStreamEvent.Data, async tweet => {
            if(active) {
                socket.emit('tweet', tweet)
                i++
                console.log(`Data sent${i}`)
            }
        })

    } catch (error){
        console.log('FROM STREAMING')
        console.log(error)
    }
}

const getStream = () => {
    return stream;
}

const closeStream = () => {
    stream.close();
}

module.exports = { router, resetRules, setRules, getRules, deleteRules, getStream, startStream, closeStream };
