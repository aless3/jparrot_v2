
jest.mock("axios");
const axios = require("axios");

const keywordFile = require("../blobs/KeywordAxiosFedez.json");
const sentimentFile = require("../blobs/SentimentAxiosFedez.json");
const termsFile = require("../blobs/TermsAxios.json");
const competitionFile1 = require("../blobs/CompetitionTest1.json")
const competitionFile2 = require("../blobs/CompetitionTest2.json")
let competitionUpdate = false;

axios.get.mockImplementation((url) => {
    let result = {
        data: undefined,
    };
    if (url.includes("keyword")) {
        return {
            data: keywordFile
        };
    } else if (url.includes("sentiment")) {
        return {
            data: sentimentFile
        };
    } else if (url.includes("terms")) {
        return {
            data: termsFile
        };
    } else if(url.includes("competition")) {
        if(!competitionUpdate){
            competitionUpdate = true;
            return {
                data: competitionFile1
            };
        } else {
            return {
                data: competitionFile2
            };
        }
    }
    return Promise.resolve(result);
});

