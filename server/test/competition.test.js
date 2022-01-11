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

test('check containsWrongsAnswers correctly detects wrong answers', () => {
    let text = "old pond frog leaps in water's sound"
    let wrong = ["the first cold shower"]
    expect(competition.containsWrongsAnswers(text, wrong)).toBeFalsy();

    wrong = ["the first cold shower", "old pond frog"]
    expect(competition.containsWrongsAnswers(text, wrong)).toBeTruthy();

    wrong = ["the first cold shower", "old pond frog!"]
    expect(competition.containsWrongsAnswers(text, wrong)).toBeFalsy();
});

test('check buildQuery correctly builds the query', () => {
    let hashtag = "#test"
    let expectedQuery = "#competition #jparrot_v2 #uniboswe2021 is:reply #test";

    expect(competition.buildQuery(hashtag)).toEqual(expectedQuery)


    let correctAnswer = "the cat is on the table";
    expectedQuery = "#competition #jparrot_v2 #uniboswe2021 is:reply #test the cat is on the table";

    expect(competition.buildQuery(hashtag, correctAnswer)).toEqual(expectedQuery)
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

test('check organizeCompetition correctly organizes the replies correctly using stored blobs', () => {
    const input = require('../blobs/organizeCompetition_input.json');
    const expectedOutput = require('../blobs/organizeCompetition_output.json');

    let realOutput = competition.organizeCompetition(input)

    expect(realOutput).toEqual(
        expect.objectContaining(expectedOutput)
    );
});

test('check extractIndices correctly extracts indices', () => {
    const input = require('../blobs/organizeCompetition_input.json');
    const expectedOutput = {
        data: [input.data[0]],
        includes: {
            users: [input.includes.users[0]]
        }
    }
    // 267138741
    let realOutput = competition.extractIndices(input, [0])

    expect(realOutput.data).toEqual(expectedOutput.data)
    expect(realOutput.includes.users).toEqual(expectedOutput.includes.users)
});

// test('check organizeCompetition correctly organizes the replies correctly using stored blobs', () => {
//     const input = require('../blobs/organizeCompetition_input.json');
//     const expectedOutput = require('../blobs/organizeCompetition_output.json');
//
//     let realOutput = competition.organizeCompetition(input)
//
//     expect(realOutput).toEqual(
//         expect.objectContaining(expectedOutput)
//     );
// });

test('check organizeReplies correctly returns an empty result on error', () => {
    let errorResult = {}
    errorResult.data = []

    errorResult.includes = {}
    errorResult.includes.users = []

    let output = competition.organizeReplies(null, null)

    expect(output).toEqual(errorResult)
});

test('check organizeReplies correctly correctly computes data for competition using stored blobs', () => {
    const input = require('../blobs/organizeAnswers_input.json');
    const wa = require('../blobs/organizeAnswers_wa.json');

    let realOutput = competition.organizeAnswers(input, wa)

    let date0 = new Date(realOutput.data[0].created_at)
    let date1 = new Date(realOutput.data[1].created_at)
    let date2 = new Date(realOutput.data[2].created_at)
    let date3 = new Date(realOutput.data[3].created_at)

    expect(date0.getTime() < date1.getTime()).toBeTruthy()
    expect(date1.getTime() < date2.getTime()).toBeTruthy()
    expect(date2.getTime() < date3.getTime()).toBeTruthy()
});

test('check organizeReplies correctly correctly computes data with answers', () => {
    const input = require('../blobs/organizeCompetition_input.json');
    const wa = require('../blobs/organizeAnswers_wa.json');

    let realOutput = competition.organizeAnswers(input, wa)


    let date0 = new Date(realOutput.data[0].created_at)
    let date1 = new Date(realOutput.data[1].created_at)
    let date2 = new Date(realOutput.data[2].created_at)
    let date3 = new Date(realOutput.data[3].created_at)

    expect(date0.getTime() < date1.getTime()).toBeTruthy()
    expect(date1.getTime() < date2.getTime()).toBeTruthy()
    expect(date2.getTime() < date3.getTime()).toBeTruthy()
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