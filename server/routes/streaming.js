const { ETwitterStreamEvent, TwitterApi } = require("twitter-api-v2");

const express = require("express");

const wf = require("word-freq");

const appOnlyClient = new TwitterApi(process.env.CORE_NEW);
const streamingClient = appOnlyClient.readOnly;

const router = express.Router();
let stream;

let text = "";

/**
 *  @module streaming
 */

/**
 *  @function
 *  @name resetRules
 *  @description - Rule reset function.
 *  Deletes all set rules.
 *  @async
 *  @param client - the client to use [optional, if not passed use streamingClient]
 */
const resetRules = async (client = streamingClient) => {
  let rules = await client.v2.streamRules();
  if (rules.data?.length) {
    await deleteRules(
      rules.data.map((rule) => rule.id),
      client
    );
  }
};

/**
 *  @function
 *  @name setRules
 *  @description - Rule insertion function.
 *  Add rules passed by argument. (WHAT DOES IT DO WITH ALREADY EXISTING RULES?)
 *  @async
 *  @param rules - the list of rule strings to add to the rules applied for tweets filtering.
 *  @param client - the client to use [optional, if not passed use streamingClient]
 */
const setRules = async (rules, client = streamingClient) => {
  if (rules.length > 0) {
    await client.v2.updateStreamRules({
      add: rules.map((keyword) => {
        return { value: keyword };
      }),
    });
  }
};

/**
 *  @function
 *  @name getRules
 *  @description - Rule output function.
 *  Returns all the rules applied for tweets filtering.
 *  @async
 *  @param client - the client to use [optional, if not passed use streamingClient]
 *  @returns {Promise} - returns the tweet filtering rules as a Promise<StreamingV2GetRulesResult>
 */
const getRules = async (client = streamingClient) => {
  return client.v2.streamRules();
};

/**
 *  @function
 *  @name deleteRules
 *  @description - Rule deletion function.
 *  Delete rules passed by argument, keeps all others.
 *  @async
 *  @param args - the list of rule IDs to remove from the rules applied for tweets filtering.
 *  @param client - the client to use [optional, if not passed use streamingClient]
 */
const deleteRules = async (args, client = streamingClient) => {
  if (args.length > 0) {
    await client.v2.updateStreamRules({
      delete: {
        ids: args,
      },
    });
  }
};

/**
 *  Rule reset and insertion function.
 *  Reset rules and add the new ones.
 *  @async
 *  @param args - the list of rule IDs to insert after the reset.
 *  @param client - the client to use [optional, if not passed use streamingClient]
 *  @return {boolean} - returns true if successful, false otherwise.
 */
const reloadRules = async (args, client = streamingClient) => {
  try {
    await resetRules(client);
    await setRules(args, client);
    return true;
  } catch (error) {
    console.log("FROM RESET-AND-SET ");
    console.log(error);
    return false;
  }
};

/**
 *  @function
 *  @name startStream
 *  @description - Streaming function.
 *  Set rules, starts stream
 *  @async
 *  @param args - the list of rules to set for tweets filtering
 *  @param socket - the io socket to emit data to
 *  @param client - the client to use [optional, if not passed use streamingClient]
 *  @returns {stream} - returns the created stream
 */
const startStream = async (args, socket, client = streamingClient) => {
  try {
    text = "";
    await reloadRules(args, client);
    stream = await client.v2.searchStream({
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "text"],
      "user.fields": ["username", "name", "profile_image_url"],
    });
    stream.autoReconnect = true;
    stream.on(ETwitterStreamEvent.Data, async (tweet) => {
      socket.emit("tweet", tweet);
      text = text.concat(" ");
      text = text.concat(tweet.data.text);
    });
  } catch (error) {
    console.log(error);
    return false;
  }

  return stream;
};

/**
 *  @function
 *  @name getStream
 *  @returns - Returns the stream
 *  @description - Get stream handler function.
 *  Get the twitter v2 api stream handler. This function makes it possible
 *  to obtain the stream object from outside this file
 */
const getStream = () => {
  return stream;
};

/**
 *  @function
 *  @name closeStream
 *  @description - Close stream handler function.
 *  Close the twitter v2 api stream handler. This function makes it possible
 *  to close the stream object from outside this file
 */
const closeStream = async (socket = null) => {
  if (stream !== undefined) {
    if (socket) {
      let data = wordFreq();
      await socket.emit("text", data);
    }
    stream.close();
  }
};

const wordFreq = (data = text) => {
  if(!data){
   return undefined;
  }
  let dataArray = Object.entries(wf.freq(data, true, false));
  dataArray = dataArray.filter((word) => word[0].length > 2);
  dataArray.sort(function (a, b) {
    return b[1] - a[1];
  });
  dataArray = dataArray.slice(0, 10);
  return dataArray;
};

module.exports = {
  router,
  resetRules,
  setRules,
  getRules,
  deleteRules,
  reloadRules,
  getStream,
  startStream,
  closeStream,
  wordFreq,
};
