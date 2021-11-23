const express = require('express')
const {ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError } = require('twitter-api-v2');

const appOnlyClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAF1UWAEAAAAAS8QQjbrqLHu7VBtWkhZir4EEYU8%3DY2GweqRNYT4hYKZMTXTkI6wwdpdG7HbWURVNjZUd5eAYhm2yHO');

const client = appOnlyClient.readOnly

const printUser = () => {
    return  roClient.v2.get('tweets/search/recent', {query: 'italy', max_results: 10})
}

// printUser().then((res)=>{
//     res.data.map((tweet)=>{
//         console.log(tweet.text)
//     })
//      console.log(res)
// })

const getStreaming = async () => {
    const rules = await client.v2.streamRules()
    if (rules.data?.length){
        await client.v2.updateStreamRules({
            delete: {ids: rules.data.map(rule => rule.id)}
        })
    }

    await client.v2.updateStreamRules({
        add: [{ value: 'zanichelli'}, {value: 'bressanardini'}]
    })

    const stream = await client.v2.searchStream({
        'tweet.fields': ['author_id', 'text']
    })
    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.Data, async tweet => {
        console.log(tweet)
    })
}

getStreaming()