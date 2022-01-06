'use strict';

module.exports = {
    "plugins": [],
    "recurseDepth": 10,
    "source": {
        "include": ["server/routes/", "README.md"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    },
    "opts": {
        "recursive": true,
        "destination": "./documentation/result/",
        "template": "./documentation/template/docdash/"
    },
    "swaggerDefinition": {
    "info": {
        "title": "My sample api",
        "version": "1.0.0"
    }
    },
    "apis": ["server/routes/index.js"]
}
