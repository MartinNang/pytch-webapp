import {deGlobal, deHelpSidebarContent, enGlobal, enHelpSidebarContent, gaGlobal, gaHelpSidebarContent} from './index';
import * as fs from "node:fs";

function generateLocaleJSONFiles(lang, globalJSON, helpSidebarContent) {
    // read every term
    let localFilesContents = {};
    let newHelpSidebarContent = helpSidebarContent;
    for (const term in globalJSON) {
        let translation = globalJSON[term];
        let currentPrefix = term.substring(0, term.indexOf('.'));
        let currentLocaleTerm = term.substring(term.indexOf('.') + 1);
        if (currentPrefix !== "help-sidebar") {
            // remove prefix, insert translations into new file
            if (localFilesContents[currentPrefix] === undefined) localFilesContents[currentPrefix] = {};
            localFilesContents[currentPrefix][currentLocaleTerm] = translation;
        } else {
            const slug = currentLocaleTerm.substring(0, currentLocaleTerm.indexOf('.'));
            const prop = currentLocaleTerm.substring(currentLocaleTerm.indexOf('.')+1);

            if (prop === 'help') {
                newHelpSidebarContent.find((elem) => elem.slug === slug).help = translation;
            }
            else if (prop === 'help.flat') {
                newHelpSidebarContent.find((elem) => elem.slug === slug).help.flat = translation;
            }
            else if (prop === 'help.per-method') {
                newHelpSidebarContent.find((elem) => elem.slug === slug).help["per-method"] = translation;
            }
            else if (prop === 'help.per-method.stage') {
                newHelpSidebarContent.find((elem) => elem.slug === slug).help['per-method']['stage'] = translation;
            }
            else if (prop === 'help.per-method.sprite') {
                newHelpSidebarContent.find((elem) => elem.slug === slug).help['per-method']['sprite'] = translation;
            }
        }
    }
    console.log(localFilesContents);
    console.log(newHelpSidebarContent);
    fs.mkdir(`./${lang}`, { recursive: true}, err => {
        // create new file for new prefix (except help-sidebar)
        for (let localFileContent in localFilesContents) {
            localFilesContents[localFileContent]["$RUBBISH$"] = "";
            const outputFilePath = `./${lang}/${localFileContent}.json`;
            fs.writeFileSync(outputFilePath, JSON.stringify(localFilesContents[localFileContent], null, " "));
        }
    });
    const outputFilePath = `../data/help-sidebar/content/${lang}.json`;
    fs.writeFileSync(outputFilePath, JSON.stringify(newHelpSidebarContent, null, " "));
}

generateLocaleJSONFiles("en", enGlobal, enHelpSidebarContent);
generateLocaleJSONFiles("ga", gaGlobal, gaHelpSidebarContent);
generateLocaleJSONFiles("de", deGlobal, deHelpSidebarContent);