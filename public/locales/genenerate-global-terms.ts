import {
    deHelpSidebarContent,
    enAssets, enCommon, enDemos, enErrors, enFlows, enHelpSidebarContent, enIde, enNotableChanges, enProjects, enTutorials, enVm, enWelcome,
    gaHelpSidebarContent,
    helpSidebarStructure
} from './index';
import { gaAssets, gaCommon, gaErrors, gaFlows, gaIde, gaNotableChanges, gaProjects, gaTutorials, gaVm, gaWelcome } from './index';
import * as fs from "node:fs";

// TODO: use fetch instead of import

function generateGlobalEnglishJSON() {
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
    addHelpSidebarContent(enHelpSidebarContent, mergedEnglishJSON);
    console.log("merged JSON object:", mergedEnglishJSON);
    const outputFilePath = 'en.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedEnglishJSON, null, " "));
}

function generateGlobalIrishJSON() {
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

    addHelpSidebarContent(gaHelpSidebarContent, mergedIrishJSON);
    console.log("merged JSON object:", mergedIrishJSON);
    const outputFilePath = 'ga.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedIrishJSON, null, " "));
}

function generateLocaleHelpSidebar(lang: string, helpSidebarContent: Object) {
    let helpSidebarStructureContent = helpSidebarStructure;
    helpSidebarStructureContent.forEach((elem) => {
        let found = helpSidebarContent.find((foundElem) => {
            if (elem.slug) return foundElem.slug === elem.slug;
            if (elem["sectionSlug"]) return foundElem.sectionSlug === elem.sectionSlug;
        })

        if (found.heading) {
            elem.heading = found.heading;

            if (found.help === undefined || found.help?.length === 0) {
                delete elem.help;
            } else {
                elem.help = found.help;
            }

            if (found.scratch === undefined || found.scratch?.length === 0) {
                delete elem.scratch;
            } else {
                elem.scratch = found.scratch;
            }
        } else {
            delete elem.heading;

            elem.help = found.help || "";
            if (elem.kind === "pure-python") {
                delete elem.scratch;
            } else {
                elem.scratch = found.scratch || "";
            }
        }
    });

    console.log("writing locale:", helpSidebarStructureContent);
    const outputFilePath = `../data/help-sidebar/output/${lang}.json`;
    fs.writeFileSync(outputFilePath, JSON.stringify(helpSidebarStructureContent, null, " "));
}

function addHelpSidebarContent(helpSidebarContent, globalEnglish) {
    helpSidebarContent.forEach((elem) => {
        if (elem.heading) {
            globalEnglish[`help-sidebar.${elem.slug}.heading`] = elem.scratch;
        }
        if (elem.scratch) {
            globalEnglish[`help-sidebar.${elem.slug}.scratch`] = elem.scratch;
        }
        if (typeof elem.help === "string") {
            globalEnglish[`help-sidebar.${elem.slug}.help`] = elem.help;
        }
        if (typeof elem.help?.flat === "string") {
            globalEnglish[`help-sidebar.${elem.slug}.help.flat`] = elem.help.flat;
        }
        if (typeof elem.help?.["per-method"] === "string") {
            globalEnglish[`help-sidebar.${elem.slug}.help.per-method`] = elem.help["per-method"];
        }
        if (typeof elem.help?.["per-method"]?.sprite === "string") {
            globalEnglish[`help-sidebar.${elem.slug}.help.per-method.sprite`] = elem.help["per-method"].sprite;
        }
        if (typeof elem.help?.["per-method"]?.stage === "string") {
            globalEnglish[`help-sidebar.${elem.slug}.help.per-method.stage`] = elem.help["per-method"].stage;
        }
    })
}

function generateLocaleJSONFiles(lang, globalJSON) {
    // TODO:
    // read every term
    // create new file for new prefix (except help-sidebar)
    // remove prefix, insert translations
    //
}

/*const subDirs = fs.readdirSync('.').filter(file => fs.lstatSync(file).isDirectory());
subDirs.forEach(dir => {

})*/

generateGlobalEnglishJSON();
generateGlobalIrishJSON();
generateLocaleHelpSidebar("en", enHelpSidebarContent);
generateLocaleHelpSidebar("ga", gaHelpSidebarContent);
generateLocaleHelpSidebar("de", deHelpSidebarContent);

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
