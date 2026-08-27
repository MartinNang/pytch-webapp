import {
    deAssets,
    deCommon,
    deErrors,
    deFlows, deHelpSidebarContent,
    deIde,
    deNotableChanges,
    deProjects,
    deTutorials,
    deVm,
    deWelcome,
    enAssets,
    enCommon,
    enDemos,
    enErrors,
    enFlows,
    enHelpSidebarContent,
    enIde,
    enNotableChanges,
    enProjects,
    enTutorials,
    enVm,
    enWelcome,
    gaAssets,
    gaCommon,
    gaErrors,
    gaFlows,
    gaHelpSidebarContent,
    gaIde,
    gaNotableChanges,
    gaProjects,
    gaTutorials,
    gaVm,
    gaWelcome
} from './index';
import * as fs from "node:fs";

function generateGlobalJSON(lang: string, helpSidebarContent: Object, mergedJSON) {
    addHelpSidebarContent(helpSidebarContent, mergedJSON);
    const outputFilePath = `${lang}.json`;
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedJSON, null, " "));
}

function addHelpSidebarContent(helpSidebarContent, globalJSON) {
    helpSidebarContent.forEach((elem) => {
        if (elem.heading) {
            globalJSON[`help-sidebar.${elem.slug}.heading`] = elem.scratch;
        }
        /*if (elem.scratch) {
            globalEnglish[`help-sidebar.${elem.slug}.scratch`] = elem.scratch;
        }*/
        if (typeof elem.help === "string") {
            globalJSON[`help-sidebar.${elem.slug}.help`] = elem.help;
        }
        if (typeof elem.help?.flat === "string") {
            globalJSON[`help-sidebar.${elem.slug}.help.flat`] = elem.help.flat;
        }
        if (typeof elem.help?.["per-method"] === "string") {
            globalJSON[`help-sidebar.${elem.slug}.help.per-method`] = elem.help["per-method"];
        }
        if (typeof elem.help?.["per-method"]?.sprite === "string") {
            globalJSON[`help-sidebar.${elem.slug}.help.per-method.sprite`] = elem.help["per-method"].sprite;
        }
        if (typeof elem.help?.["per-method"]?.stage === "string") {
            globalJSON[`help-sidebar.${elem.slug}.help.per-method.stage`] = elem.help["per-method"].stage;
        }
    })
}

// TODO: use fetch instead of import
/*const subDirs = fs.readdirSync('.').filter(file => fs.lstatSync(file).isDirectory());
subDirs.forEach(dir => {

})*/
const mergedEnglishJSON = Object.assign({},
    addPrefixToJSON("assets", enAssets),
    addPrefixToJSON("common", enCommon),
    addPrefixToJSON("demos", enDemos),
    addPrefixToJSON("errors", enErrors),
    addPrefixToJSON("flows", enFlows),
    addPrefixToJSON("ide", enIde),
    addPrefixToJSON("notable-changes", enNotableChanges),
    addPrefixToJSON("projects", enProjects),
    addPrefixToJSON("tutorials", enTutorials),
    addPrefixToJSON("vm", enVm),
    addPrefixToJSON("welcome", enWelcome),
);

const mergedIrishJSON = Object.assign({},
    addPrefixToJSON("assets", gaAssets),
    addPrefixToJSON("common", gaCommon),
    addPrefixToJSON("errors", gaErrors),
    addPrefixToJSON("flows", gaFlows),
    addPrefixToJSON("ide", gaIde),
    addPrefixToJSON("notable-changes", gaNotableChanges),
    addPrefixToJSON("projects", gaProjects),
    addPrefixToJSON("tutorials", gaTutorials),
    addPrefixToJSON("vm", gaVm),
    addPrefixToJSON("welcome", gaWelcome),
);

const mergedGermanJSON = Object.assign({},
    addPrefixToJSON("assets", deAssets),
    addPrefixToJSON("common", deCommon),
    addPrefixToJSON("errors", deErrors),
    addPrefixToJSON("flows", deFlows),
    addPrefixToJSON("ide", deIde),
    addPrefixToJSON("notable-changes", deNotableChanges),
    addPrefixToJSON("projects", deProjects),
    addPrefixToJSON("tutorials", deTutorials),
    addPrefixToJSON("vm", deVm),
    addPrefixToJSON("welcome", deWelcome),
);

generateGlobalJSON("en", enHelpSidebarContent, mergedEnglishJSON);
generateGlobalJSON("ga", gaHelpSidebarContent, mergedIrishJSON);
generateGlobalJSON("de", deHelpSidebarContent, mergedGermanJSON);

function addPrefixToJSON(prefix: string, jsonFile: Object): Object {
    delete jsonFile["$RUBBISH$"];

    let str: string = JSON.stringify(jsonFile);

    // TODO: use better regex (I don't know how to do this with only one pattern)
    const pat: RegExp = /"*([a-zA-Z.\-_0-9])*":/gm;
    str = str.replace(pat, `"${prefix}.$&`);

    const pat2: RegExp = new RegExp(`\"${prefix}.\"`, 'g');
    let res = str.replace(pat2, `\"${prefix}.`);

    return JSON.parse(res);
}
