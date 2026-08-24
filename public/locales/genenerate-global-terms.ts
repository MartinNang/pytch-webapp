import { enAssets, enCommon, enDemos, enErrors, enFlows, enIde, enNotableChanges, enProjects, enTutorials, enVm, enWelcome } from './index';
import { gaAssets, gaCommon, gaErrors, gaFlows, gaIde, gaNotableChanges, gaProjects, gaTutorials, gaVm, gaWelcome } from './index';
import * as fs from "node:fs";

// TODO: use fetch instead of import

function generatePytchEnglishJSON() {
    let englishAssets: Object = addPrefixToJSON("assets", enAssets);
    let englishCommon: Object = addPrefixToJSON("common", enCommon);
    let englishDemos: Object = addPrefixToJSON("demos", enDemos);
    let englishErrors: Object = addPrefixToJSON("errors", enErrors);
    let englishFlows: Object = addPrefixToJSON("flows", enFlows);
    let englishIde: Object = addPrefixToJSON("ide", enIde);
    let englishNotableChanges: Object = addPrefixToJSON("notable-changes", enNotableChanges);
    let englishProjects: Object = addPrefixToJSON("projects", enProjects);
    let englishTutorials: Object = addPrefixToJSON("tutorials", enTutorials);
    let englishVm: Object = addPrefixToJSON("vm", enVm);
    let englishWelcome: Object = addPrefixToJSON("welcome", enWelcome);

    const mergedEnglishJSON = Object.assign({},
        englishAssets,
        englishCommon,
        englishDemos,
        englishErrors,
        englishFlows,
        englishIde,
        englishNotableChanges,
        englishProjects,
        englishTutorials,
        englishVm,
        englishWelcome,
    );

    console.log("merged JSON object:", mergedEnglishJSON);
    const outputFilePath = 'pytch-english.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedEnglishJSON));
}

function generatePytchIrishJSON() {
    let irishAssets: Object = addPrefixToJSON("assets", gaAssets);
    let irishCommon: Object = addPrefixToJSON("common", gaCommon);
    let irishErrors: Object = addPrefixToJSON("errors", gaErrors);
    let irishFlows: Object = addPrefixToJSON("flows", gaFlows);
    let irishIde: Object = addPrefixToJSON("ide", gaIde);
    let irishNotableChanges: Object = addPrefixToJSON("notable-changes", gaNotableChanges);
    let irishProjects: Object = addPrefixToJSON("projects", gaProjects);
    let irishTutorials: Object = addPrefixToJSON("tutorials", gaTutorials);
    let irishVm: Object = addPrefixToJSON("vm", gaVm);
    let irishWelcome: Object = addPrefixToJSON("welcome", gaWelcome);

    const mergedIrishJSON = Object.assign({},
        irishAssets,
        irishCommon,
        irishErrors,
        irishFlows,
        irishIde,
        irishNotableChanges,
        irishProjects,
        irishTutorials,
        irishVm,
        irishWelcome,
    );

    console.log("merged JSON object:", mergedIrishJSON);
    const outputFilePath = 'pytch-irish.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedIrishJSON));
}

generatePytchEnglishJSON();
generatePytchIrishJSON();

function addPrefixToJSON(prefix: string, jsonFile: Object): Object {
    delete jsonFile["$RUBBISH$"];

    let str: string = JSON.stringify(jsonFile);

    const pat: RegExp = /"*([a-zA-Z.\-_0-9])*":/gm;
    str = str.replace(pat, `"${prefix}.$&`);

    const pat2: RegExp = new RegExp(`\"${prefix}.\"`, 'g');
    let res = str.replace(pat2, `\"${prefix}.`);

    return JSON.parse(res);
}
