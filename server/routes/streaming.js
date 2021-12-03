const
{
    ETwitterStreamEvent,
    TweetStream,
    TwitterApi,
    ETwitterApiError
} = require('twitter-api-v2');

const path = require('path')
const express = require('express')
const appOnlyClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAF1UWAEAAAAAS8QQjbrqLHu7VBtWkhZir4EEYU8%3DY2GweqRNYT4hYKZMTXTkI6wwdpdG7HbWURVNjZUd5eAYhm2yHO');

const client = appOnlyClient.readOnly

var router = express.Router()
var stream

router.get('/', (req, res) =>{
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

const resetRules = async () => {
    var rules = await client.v2.streamRules()
    if(rules.data.length){
        await deleteRules(rules.data.map(rule=>rule.id))
    }
}

const setRules = async (arguments) => {
    if(arguments.length > 0){
        await client.v2.updateStreamRules({
            add: arguments.map((keyword)=>{
                return{value: keyword}
            })
        })
        var rules = await client.v2.streamRules()
        console.log(rules)
    }
}

const getRules = async () => {
     return await client.v2.streamRules()
}

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

const startStream = async (args, socket) => {
    var i = 0
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

module.exports = router