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
 *  @description - Funzione di reset delle rules.
 *  Eliminia tutte le regole.
 *  @async
 *  @param client - il client da usare [optionale, se non passato usa streamingClient]
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
 *  @description - Funzione di agguinta delle rules.
 *  Aggiunge le regole passate come argomento, se una regola e' gia' presente non fa nulla.
 *  @async
 *  @param rules - La lista delle stringhe da impostare come filtri.
 *  @param client - Il client da usare [opzionale, se non presente usa streamingClient]
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
 *  @description - Funzione di output delle regole.
 *  Restituisve tutte le regole impostate al momento.
 *  @async
 *  @param client - Il client da usare [opzionale, se non presente usa streamingClient]
 *  @returns {Promise} - restituisce le regole impostare al momento sottoforma di Promise<StreamingV2GetRulesResult>
 */
const getRules = async (client = streamingClient) => {
  return client.v2.streamRules();
};

/**
 *  @function
 *  @name deleteRules
 *  @description - Funzione di cancellazioine delle regole.
 *  Elimina le regole passate come argomento, lascia le altre.
 *  @async
 *  @param args - la lista degli id delle regole da rimuovere.
 *  @param client - Il client da usare [opzionale, se non presente usa streamingClient]
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
 * @function
 * @description -  Funzione di aggiornamento delle regole.
 * Elimina tutte le regole presenti e imposta quelle passate come parametro
 *  @async
 *  @param args - Le regole da impostare dopo aver eliminato quelle precedenti.
 *  @param client - Il client da usare [opzionale, se non presente usa streamingClient]
 *  @return {boolean} - ritorna true se ha successo, false altrimenti.
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
 *  @description - Funzione di streaming.
 *  Imposta le regole e fa partire lo streaming
 *  @async
 *  @param args - La lista delle regole da impostare
 *  @param socket - Il socket io verso cui mandare i tweet
 *  @param client - Il client da usare [opzionale, se non presente usa streamingClient]
 *  @returns {stream} - Ritorna lo stream.
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
 *  @description - Funzione per avere lo handler dello stream.
 *  Questa funzione permette di ottenere lo handler per lo streaming al di fuori di questo file
 */
const getStream = () => {
  return stream;
};

/**
 *  @function
 *  @name closeStream
 *  @description - Funzione di chiusira dello stream.
 *  Manda al front end le 10 parole con piu' utilizzate tra i tweet ottenuti durante lo stream, e chiude la connessione con l'API
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

/**
 * @function
 * @name wordFreq
 * @description - Funzione di analisi del testo.
 * Prende un testo e restituisce le 10 parole piu' utilizzate in esso, rimuovendo le parole piu' piccole di 2 caratteri
 * @param data - Il testo da analizzare
 * @returns  - un array di array, dove ciascuno indice contiene la parola e il numero di volte che compare nel testo
 */
const wordFreq = (data = text) => {
  if (!data) {
    return undefined;
  }
  let dataArray = Object.entries(wf.freq(data, true, false));
  dataArray = dataArray.filter((word) => {
    return word[0].length > 2 && word[0] !== "https";
  });
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
