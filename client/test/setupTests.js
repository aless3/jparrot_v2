
jest.mock("axios");
const axios = require("axios");

const keywordFile = require("../blobs/KeywordAxiosFedez.json");
const sentimentFile = require("../blobs/SentimentAxiosFedez.json");
const termsFile = require("../blobs/TermsAxios.json");

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

    }
    return Promise.resolve(result);
});

