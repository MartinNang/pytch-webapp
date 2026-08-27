import {deHelpSidebarContent, enHelpSidebarContent, gaHelpSidebarContent, helpSidebarStructure} from './index';
import * as fs from "node:fs";

// TODO: use fetch instead of import
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
// TODO: automatically translate scratch text

generateLocaleHelpSidebar("en", enHelpSidebarContent);
generateLocaleHelpSidebar("ga", gaHelpSidebarContent);
generateLocaleHelpSidebar("de", deHelpSidebarContent);
