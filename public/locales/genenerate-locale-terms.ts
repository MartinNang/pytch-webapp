import {deGlobal, enGlobal, gaGlobal} from './index';
import * as fs from "node:fs";

function generateLocaleJSONFiles(lang, globalJSON) {
    // TODO:
    // read every term
    let lastPrefix = "";
    let localFilesContents = {};
    for (const term in globalJSON) {
        let currentPrefix = term.substring(0, term.indexOf('.'));
        let currentLocaleTerm = term.substring(term.indexOf('.') + 1);
        if (currentPrefix !== "help-sidebar") {
            // remove prefix, insert translations into new file
            if (localFilesContents[currentPrefix] === undefined) localFilesContents[currentPrefix] = {};
            localFilesContents[currentPrefix][currentLocaleTerm] = globalJSON[term];
        }
    }
    console.log(localFilesContents);
    fs.mkdir(`./${lang}`, { recursive: true}, err => {
        // create new file for new prefix (except help-sidebar)
        for (let localFileContent in localFilesContents) {
            localFilesContents[localFileContent]["$RUBBISH$"] = "";
            const outputFilePath = `./${lang}/${localFileContent}.json`;
            fs.writeFileSync(outputFilePath, JSON.stringify(localFilesContents[localFileContent], null, " "));
        }
    });
}

generateLocaleJSONFiles("en", enGlobal);
generateLocaleJSONFiles("ga", gaGlobal);
generateLocaleJSONFiles("de", deGlobal);