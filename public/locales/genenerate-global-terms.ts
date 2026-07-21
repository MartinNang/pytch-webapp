import { assets, common, errors, flows, ide, notableChanges, projects, tutorials, vm, welcome } from './en';
import * as fs from "node:fs";

let globalAssets: Object = addPrefixToJSON(Object.keys({assets})[0], assets);
let globalCommon: Object = addPrefixToJSON(Object.keys({common})[0], common);
let globalErrors: Object = addPrefixToJSON(Object.keys({errors})[0], errors);
let globalFlows: Object = addPrefixToJSON(Object.keys({flows})[0], flows);
let globalIde: Object = addPrefixToJSON(Object.keys({ide})[0], ide);
let globalNotableChanges: Object = addPrefixToJSON("notable-changes", notableChanges);
let globalProjects: Object = addPrefixToJSON(Object.keys({projects})[0], projects);
let globalTutorials: Object = addPrefixToJSON(Object.keys({tutorials})[0], tutorials);
let globalVm: Object = addPrefixToJSON(Object.keys({vm})[0], vm);
let globalWelcome: Object = addPrefixToJSON(Object.keys({welcome})[0], welcome);

const mergedJSON = Object.assign({},
    globalAssets,
    globalCommon,
    globalErrors,
    globalFlows,
    globalIde,
    globalNotableChanges,
    globalProjects,
    globalTutorials,
    globalVm,
    globalWelcome,
);

console.log("merged JSON object:", mergedJSON);
const outputFilePath = 'pytch-english.json';
fs.writeFileSync(outputFilePath, JSON.stringify(mergedJSON));

function addPrefixToJSON(prefix: string, jsonFile: Object): Object {
    delete jsonFile["$RUBBISH$"];

    let str: string = JSON.stringify(jsonFile);

    const pat: RegExp = /"*([a-zA-Z.\-_0-9])*":/gm;
    str = str.replace(pat, `"${prefix}.$&`);

    const pat2: RegExp = new RegExp(`\"${prefix}.\"`, 'g');
    let res = str.replace(pat2, `\"${prefix}.`);

    return JSON.parse(res);
}
