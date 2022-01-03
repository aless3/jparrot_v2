const
{
    ETwitterStreamEvent,
    TwitterApi
} = require('twitter-api-v2');

const path = require('path')
const express = require('express')

const appOnlyClient = new TwitterApi(process.env.CORE_BEARER);

const client = appOnlyClient.readOnly

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
const resetRules = async () => {
    let rules = await client.v2.streamRules()
    if(rules.data?.length){
        await deleteRules(rules.data.map(rule=>rule.id))
    }
}

/**
 *  Rule insertion function.
 *  Adds rules passed by argument. (WHAT DOES IT DO WITH ALREADY EXISTING RULES?)
 *  @async
 *  @param rules - the list of rule strings to add to the rules applied for tweets filtering.
 *
 */
const setRules = async (rules) => {
    if(rules.length > 0){
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
 *
 */
const getRules = async () => {
     return client.v2.streamRules()
}

/**
 *  Rule deletion function.
 *  Deletes rules passed by argument, keeps all others.
 *  @async
 *  @param args - the list of rule IDs to remove from the rules applied for tweets filtering.
 *
 */
const deleteRules = async (args) => {
    if(args.length > 0){
        await client.v2.updateStreamRules({
            delete:{
                ids: args
            }
        })
        console.log('Rules Deleted')
    }
}

/**
 *  Streaming function.
 *  Sets rules, starts stream
 *  @async
 *  @param args - the list of rules to set for tweets filtering
 *  @param socket - the io socket to emit data to
 *
 */
const startStream = async (args, socket) => {
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
            'tweet.fields': ['author_id', 'text', 'geo']
        })
        stream.autoReconnect = true
        stream.on(ETwitterStreamEvent.Data, async tweet => {
            //console.log(tweet)
            socket.emit('tweet', tweet)
            i++
            console.log(`Data sent${i}`)
        })
    } catch (error){
        console.log('FROM STREAMING')
        console.log(error)
    }
}

io.on('connection', (socket)=>{
    console.log('user connected')

    socket.on('start-stream', ()=>{
        console.log('stream starting')
        startStream(['trump'], socket).then()
    })
    socket.on('end-stream', ()=>{
        console.log('stream closing')
        stream.close()
    })
})

module.exports = router
