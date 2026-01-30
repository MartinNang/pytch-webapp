import { i18n } from "i18next";
import { I18nParams, I18nStringSpec } from "./core-types";

export function resolveIndirectParams(
  i18n: i18n,
  spec: I18nStringSpec
): I18nParams {
  let resolvedParams = { ...spec.params };

  if (spec.indirectParams) {
    for (const [paramName, fqKey] of Object.entries(spec.indirectParams)) {
      if (paramName in resolvedParams) {
        console.error(`indirect param "${paramName}" already exists in params`);
      } else {
        const value = i18n.t(fqKey.key, { ns: fqKey.ns });
        resolvedParams[paramName] = value;
      }
    }
  }

  return resolvedParams;
}
