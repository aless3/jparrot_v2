/** @module competition */

const { TwitterApi } = require("twitter-api-v2");

const express = require("express");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const competitionClient = appOnlyClient.readOnly;

const router = express.Router();

/**
 * @function
 * @name hasWhiteSpace
 * @description - Funzione di verifica.
 * Verifica che la stringa passata abbiamo o meno spazi
 * @param {String} s  - Stringa da controllare
 * @returns {Boolean} - True se stringa contiene spazi, false altrimenti
 */
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

/**
 * @function
 * @name buibuildQuery
 * @description - Funzione di costruzione della query.
 * Prende un hashtag ed eventuali risposte corrette, e prepara una stringa unica contenente entrambi
 * @param {String} hashtag - Stringa contenente hashtag
 * @param {String} correctAnswer - Stringa opzionale contenente la risposta corretta
 * @returns {String} - Stringa contenente gli eventuali due parametri in input
 */
function buildQuery(hashtag, correctAnswer = null) {
  let query = "#competition #jparrot_v2 #uniboswe2021 is:reply ";
  // build the no-answer query
  query = query.concat(hashtag);

  if (!correctAnswer) {
    return query;
  }

  // add a white space after the hashtag
  query = query.concat(" ");
  query = query.concat(correctAnswer);

  return query;
}

/**
 * @function
 * @name searchReplies
 * @description - Funzione di ricerca.
 * Cerca le risposte alla competizione definita dall'hashtag
 * @async
 * @param req - La query di richiesta, che contiene l'hashtag e il numero di risposte desiderate
 * @param client - Il client da usare [opzionale, se non presente usa streamingClient]
 * @returns - I dati ottenuti dalla query verso l'API, oppure undefined se non ci sono risultati
 */
async function searchReplies(req, client = competitionClient) {
  let hashtag = req.query.hashtag;
  // hashtag cannot have white spaces
  if (hasWhiteSpace(hashtag)) {
    return undefined;
  }

  if (!hashtag) {
    return undefined;
  }

  // if it is not a real hashtag, make it one adding the # symbol at the beginning
  if (hashtag.charAt(0) !== "#") {
    hashtag = "#".concat(hashtag);
  }

  // if correctAnswer is set, use it, else undefined
  let correctAnswer;
  try {
    correctAnswer = req.query.correctAnswer;
  } catch (e) {
    correctAnswer = undefined;
  }

  let max_results;
  // if max_results is set, use it, else use 200 as default
  try {
    max_results = req.query.max_results;
  } catch (e) {
    max_results = 100;
  }

  try {
    let query = buildQuery(hashtag, correctAnswer);
    console.log(query);
    const search = await client.v2.searchAll(query, {
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "public_metrics", "text", "entities"],
      "user.fields": ["username", "name", "profile_image_url"],
      max_results: max_results,
    });

    // fetchLast twice to have all results
    await search.fetchLast(max_results * 2);

    return search.data;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 *  @function
 *  @name updateLists
 *  @description - Funzione di aggiornamento.
 * Aggiorna la lista dei tweet inserendo newItem nella posizione ordinata
 *  @param lists - La lista corrente dei tweet
 *  @param newItem - Il nuovo tweet da inserire
 *  @returns - La lista aggiornata
 */
function updateLists(lists, newItem) {
  let list = lists.listLikes;
  let indices = lists.listIndices;

  let value = newItem.value;
  let index = newItem.index;

  for (let i = 0; i < list.length; i++) {
    if (value > list[i]) {
      let resultList = list.slice(0, i);
      resultList.push(value);
      resultList.push(...list.slice(i, -1));

      let resultIndices = indices.slice(0, i);
      resultIndices.push(index);
      resultIndices.push(...indices.slice(i, -1));

      let result = {};
      result.listLikes = resultList;
      result.listIndices = resultIndices;

      return result;
    }
  }

  return lists;
}

/**
 * @function
 * @name containsWrongsAnswers
 * @description - Funzione di controllo delle risposte errate.
 * Analizza la stringa per vedere se contiene una delle stringa dell'array
 * @param {String} text - La stringa da analizzare
 * @param {String[]} - Array delle stringhe da usare per l'analisi
 * @returns {Boolean} - Booleano che indica se la stringa contiene almeno una delle stringhe nell'array
 */
function containsWrongsAnswers(text, wrongAnswers = []) {
  for (const wrongAnswer of wrongAnswers) {
    try {
      if (text.includes(wrongAnswer)) {
        return true;
      }
    } catch (e) {
      return true;
    }
  }
  return false;
}

/**
 * @function
 * @name containsCorrectAnswer
 * @description - Funzione di verifica della risposta corretta.
 * Verifica se una stringa contiene un'altra stringa
 * @param {String} text - La stringa su cui effettuale la verifica
 * @param {String} correctAnswer - La stringa da usare per effettuare la verifica
 * @returns {Boolean} - Booleano che indica se text contiene CorrectAnswer
 */
function containsCorrectAnswer(text, correctAnswer = null) {
  try {
    if (text.includes(correctAnswer)) {
      return true;
    }
  } catch (e) {
    return true;
  }

  return false;
}

/**
 * @function
 * @name extractIndices
 * @description - Funzione di riordino dei tweet.
 * Riorganozza i tweet arrivati dall'API in modo che abbiano particolare ordine
 * @param replies - Le risposte ottenute da Twitter
 * @param listIndices - Il nuovo ordine secondo cui organizzarli
 * @returns - I tweet ordinati nel nuovo modo
 */
function extractIndices(replies, listIndices) {
  let result = {};
  result.data = [];

  result.includes = {};
  result.includes.users = [];

  for (const i of listIndices) {
    let tweet = replies.data[i];
    if (tweet === undefined) {
      continue;
    }

    let user = replies.includes.users.filter((u) => u.id === tweet.author_id);
    user = user[0];

    result.data.push(tweet);
    if (!result.includes.users.includes(user)) {
      result.includes.users.push(user);
    }
  }

  return result;
}
/**
 * @function
 * @name organizeAnswers
 * @description - Funzione di organizzazione dei tweet di risposta.
 * Organizza la competition nel caso ci siano solo risposte corrette o anche risposte sbagliate
 * @param  replies - I tweet ottenuti dall'API
 * @param  correctAnswer - La risposta corretta
 * @param  wrongAnswers - L'array delle risposte sbaglite
 * @returns - L'array ordinato che contiene i tweet di risposta
 */
function organizeAnswers(replies, correctAnswer, wrongAnswers = []) {
  let isWrongArray = Array.isArray(wrongAnswers);

  if (!isWrongArray) {
    return undefined;
  }

  try {
    let lists = {};
    lists.listLikes = [-1, -1, -1, -1];
    lists.listIndices = [-1, -1, -1, -1];

    for (let i = 0; i < replies.data.length; i++) {
      let cleanedText = replies.data[i].text;
      replies.data[i].entities.hashtags.map((hash) => {
        cleanedText = cleanedText.replace("#" + hash["tag"], "");
      });
      if (
        !containsWrongsAnswers(cleanedText, wrongAnswers) &&
        containsCorrectAnswer(cleanedText, correctAnswer)
      ) {
        let reply = {};
        reply.value = new Date(replies.data[i].created_at).getTime();
        reply.index = i;

        lists = updateLists(lists, reply);
      }
    }

    let listIndices = lists.listIndices;
    listIndices = listIndices.reverse();

    return extractIndices(replies, listIndices);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

/**
 * @function
 * @name organizeCompetition
 * @description - Funzione di ordinamento in base ai like.
 * Ordina i tweet secondo i like, in ordine discendente
 * @param replies - I tweet da ordinare
 * @returns - I Tweet ordinati secondo i like
 */
function organizeCompetition(replies) {
  try {
    let lists = {};
    lists.listLikes = [-1, -1, -1, -1];
    lists.listIndices = [-1, -1, -1, -1];

    for (let i = 0; i < replies.data.length; i++) {
      let reply = {};
      reply.value = replies.data[i].public_metrics.like_count;
      reply.index = i;

      lists = updateLists(lists, reply);
    }

    let listIndices = lists.listIndices;

    return extractIndices(replies, listIndices);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

/**
 * @function
 * @name organizeReplies
 * @description - Funzione di crezione della competizione
 * Decide quale tipo di competizione preparare a seconda dei parametri disponibili
 * @param  replies - I tweet
 * @param  correctAnswer - La risposta corretta, se manca assieme a wrongAnswer fara' una competition in base ai like
 * @param  wrongAnswers - Le risposte errate, se manca fara' una trivia a domanda aperta
 * @returns - I tweet ordinati secondo il tipo di competition
 */
function organizeReplies(replies, correctAnswer, wrongAnswers) {
  let errorResult = {};
  errorResult.data = [];

  errorResult.includes = {};
  errorResult.includes.users = [];

  if (!replies || !replies.meta || replies.meta.result_count === 0) {
    return errorResult;
  }

  try {
    let result;

    if (wrongAnswers && correctAnswer) {
      result = organizeAnswers(replies, correctAnswer, wrongAnswers);
    } else if (correctAnswer) {
      result = organizeAnswers(replies, correctAnswer);
    } else {
      result = organizeCompetition(replies);
    }

    if (!result) {
      result = errorResult;
    }

    return result;
  } catch (e) {
    console.log(e);
    return errorResult;
  }
}

router.get("/", async (req, res) => {
  let replies = await searchReplies(req);
  let result = organizeReplies(
    replies,
    req.query.correctAnswer,
    req.query.wrongAnswers
  );

  res.send(result);
});

module.exports = {
  router,
  searchReplies,
  organizeReplies,
  organizeCompetition,
  organizeAnswers,
  hasWhiteSpace,
  updateLists,
  containsCorrectAnswer,
  containsWrongsAnswers,
  buildQuery,
  extractIndices,
};
