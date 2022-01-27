const streaming = require("../routes/streaming.js");

require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

const appOnlyClient = new TwitterApi(process.env.CORE_BEARER);
const client = appOnlyClient.readOnly;

const mockSocket = require("mock-socket");

beforeEach(async () => {
  await streaming.resetRules(client);
});

test("check if getRules get the correct info", async () => {
  let expectedRules = await client.v2.streamRules();

  let rules = await streaming.getRules(client);

  // avoid error in case the date in the meta field is different (for example by some seconds)
  expectedRules.meta = null;
  rules.meta = null;

  expect(rules).toStrictEqual(expectedRules);
});

test("check if setRules correctly sets the rules", async () => {
  let expectedRules = ["covid", "bologna"];

  await streaming.setRules(expectedRules, client);
  // let rules = await streaming.getRules(client);
  const rules = await streaming.getRules(client);

  for (const rule in expectedRules) {
    expect(rules.data).not.toBe(
      expect.objectContaining({
        id: expect.any(String),
        value: rule,
      })
    );
  }
});

test("check if deleteRules successfully erases the rules", async () => {
  let tempRules = ["covid", "bologna"];
  let persistentRules = ["london"];
  await streaming.setRules(tempRules.concat(persistentRules), client);
  let currentRules = await streaming.getRules(client);
  let ids = [];

  currentRules.data.map((rule) => {
    if (tempRules.includes(rule.value)) {
      ids.push(rule.id);
    }
  });

  await streaming.deleteRules(ids, client);

  currentRules = await streaming.getRules(client);

  expect(tempRules.includes(currentRules.data[0].value)).toBeFalsy();
  expect(persistentRules.includes(currentRules.data[0].value)).toBeTruthy();
});

test("check if resetRules successfully resets the rules", async () => {
  await streaming.resetRules(client);
  let tempRules = ["covid", "bologna"];

  await streaming.setRules(tempRules, client);
  await streaming.resetRules(client);

  let emptyRules = await streaming.getRules(client);

  expect(emptyRules.meta.result_count).toBe(0);
});

test("reloadRules correctly reloads the rules", async () => {
  let rules = ["covid", "bologna"];

  let result = await streaming.reloadRules(rules, client);

  expect(result).toBeTruthy();
});

test("startStream correctly creates the stream", async () => {
  let rules = ["covid", "bologna"];

  let stream = await streaming.startStream(rules, mockSocket.WebSocket, client);

  expect(stream).toBeTruthy();
  expect(stream.autoReconnect).toBe(true);

  streaming.closeStream();
});

test("getStream correctly gets the stream", async () => {
  let rules = ["covid", "bologna"];

  let expectedStream = await streaming.startStream(
    rules,
    mockSocket.WebSocket,
    client
  );
  let stream = streaming.getStream();

  expect(stream).toBe(expectedStream);

  streaming.closeStream();
});

test("check error case in realoadRules", async () => {
  let result = await streaming.reloadRules();

  expect(result).toBeFalsy();
});

test("check error case in startStream", async () => {
  let result = await streaming.startStream();

  expect(result).toBeFalsy();
});
