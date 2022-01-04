






// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const Client = require("socket.io-client");
//
// let io, serverSocket, clientSocket;
// const httpServer = createServer();
// io = new Server(httpServer);

const streaming = require("../routes/streaming.js");
const
    {
        TwitterApi
    } = require('twitter-api-v2');

const appOnlyClient = new TwitterApi(process.env.CORE_BEARER);
const client = appOnlyClient.readOnly;

test('check if getRules get the correct info', async () => {
    let expectedRules = await client.v2.streamRules();

    let rules = await streaming.getRules(client);

    // avoid error in case the date in the meta field is different (for example by some seconds)
    expectedRules.meta = null;
    rules.meta = null;

    expect(rules).toStrictEqual(expectedRules);
});

/*******/
test('check if setRules correctly sets the rules', async () => {
    // let expectedRules = await client.v2.streamRules()
    // if(expectedRules.data?.length){
    //     await streaming.deleteRules(expectedRules.data.map(rule=>rule.id))
    // }
    //
    // await streaming.resetRules(client);
    // let rules = await streaming.getRules(client);
    //
    // // avoid error in case the date in the meta field is different (for example by some seconds)
    // expectedRules.meta = null;
    // rules.meta = null;
    //
    // expect(rules).toStrictEqual(expectedRules);
});

/*******/
test('check if deleteRules successfully erases the rules', async () => {

});

test('check if resetRules successfully resets the rules', async () => {
    let expectedRules = await client.v2.streamRules()
    if(expectedRules.data?.length){
        await streaming.deleteRules(expectedRules.data.map(rule=>rule.id))
    }

    await streaming.resetRules(client);
    let rules = await streaming.getRules(client);

    // avoid error in case the date in the meta field is different (for example by some seconds)
    expectedRules.meta = null;
    rules.meta = null;

    expect(rules).toStrictEqual(expectedRules);
})


// describe("streaming server", () => {
//     let io, serverSocket, clientSocket;
//     let streaming;
//
//     beforeAll((done) => {
//         // streaming = require("../routes/streaming.js");
//
//         const httpServer = createServer();
//         io = new Server(httpServer);
//         httpServer.listen(() => {
//             const port = httpServer.address().port;
//             clientSocket = new Client(`http://localhost:${port}`);
//             io.on("connection", (socket) => {
//                 serverSocket = socket;
//             });
//             clientSocket.on("connect", done);
//         });
//     });
//
//     afterAll(() => {
//         io.close();
//         clientSocket.close();
//     });
//
//     test("should work", (done) => {
//         clientSocket.on("hello", (arg) => {
//             expect(arg).toBe("world");
//             done();
//         });
//         serverSocket.emit("hello", "world");
//     });
//
//     test("should work (with ack)", (done) => {
//         serverSocket.on("hi", (cb) => {
//             cb("working");
//         });
//         clientSocket.emit("hi", (arg) => {
//             expect(arg).toBe("working");
//             done();
//         });
//     });
//
//     // test('check if getRules get the correct info', async () => {
//     //
//     //     let getRules = require("../routes/streaming.js").getRules();
//     //     let expectedRules = await client.v2.streamRules();
//     //
//     //
//     //     // let rules = await getRules(client);
//     //
//     //
//     //     // expect(rules).toEqual(expectedRules);
//     //
//     //     expect(1).toBe(1);
//     // });
// });