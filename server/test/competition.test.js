const competition = require("../routes/competition.js");

require("dotenv").config();
const {
    TwitterApi
} = require("twitter-api-v2");

const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const client = appOnlyClient.readOnly;

test('check hasWhiteSpace correctly detects spaces', () => {
    let s = "  ";
    expect(competition.hasWhiteSpace(s)).toBeTruthy();

    s = "noSpaces"
    expect(competition.hasWhiteSpace(s)).toBeFalsy();

    s = "noSpaces and a space"
    expect(competition.hasWhiteSpace(s)).toBeTruthy();
});

test('check updateLists returns the correctly updated object', () => {
    let lists = {
        listLikes: [-1, -1, -1, -1, -1],
        listIndices: [-1, -1, -1, -1, -1]
    }


    let newItem = {
        value: 6,
        index: 1
    }
    lists = competition.updateLists(lists, newItem);
    let expected = {
        listLikes: [ 6, -1, -1, -1, -1 ],
        listIndices: [ 1, -1, -1, -1, -1 ]
    }
    expect(lists).toEqual(expected)


    newItem = {
        value: 6,
        index: 2
    }
    lists = competition.updateLists(lists, newItem);
    expected = {
        listLikes: [ 6, 6, -1, -1, -1 ],
        listIndices: [ 1, 2, -1, -1, -1 ]
    }
    expect(lists).toEqual(expected)


    newItem = {
        value: 9,
        index: 3
    }
    lists = competition.updateLists(lists, newItem);
    expected = {
        listLikes: [ 9, 6, 6, -1, -1 ],
        listIndices: [ 3, 1, 2, -1, -1 ]
    }
    expect(lists).toEqual(expected)


    newItem = {
        value: 1,
        index: 4
    }
    lists = competition.updateLists(lists, newItem);
    expected = {
        listLikes: [ 9, 6, 6, 1, -1 ],
        listIndices: [ 3, 1, 2, 4, -1 ]
    }
    expect(lists).toEqual(expected)


    newItem = {
        value: -2,
        index: 5
    }
    lists = competition.updateLists(lists, newItem);
    expected = {
        listLikes: [ 9, 6, 6, 1, -1 ],
        listIndices: [ 3, 1, 2, 4, -1 ]
    }
    expect(lists).toEqual(expected)
});

test('check organizeReplies correctly organizes the replies correctly using stored blobs', () => {
    const input = require('../blobs/organizeReplies_input.json');
    const expectedOutput = require('../blobs/organizeReplies_output.json');

    let realOutput = competition.organizeReplies(input)

    expect(realOutput).toEqual(
        expect.objectContaining(expectedOutput)
    );
});

test('check if searchReplies can correctly access the info needed', async () => {
    let req = {}
    req.query = {
        hashtag: "#test",
        max_results: 10
    }

    let search = await competition.searchReplies(req, client);

    let expected = '#competition #jparrot_v2 #uniboswe2021 #test'

    expect(search.data[0].text).toEqual(
        expect.stringContaining(expected)
    )

});

test('check if searchReplies can correctly detect if the hashtag has spaces and is invalid', async () => {
    let req = {}
    req.query = {
        hashtag: " space ",
        max_results: 10
    }

    let search = await competition.searchReplies(req, client)

    expect(search).toBeFalsy()
});