import { i18n } from "i18next";
import { I18nParams, I18nStringSpec, RawOrI18nStringSpec } from "./core-types";
import { assertNever } from "../../utils";

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

/** Resolve the given `spec` into a human-readable string.  If the
 * `spec` is of kind `"raw"`, it is already human-readable.  If of kind
 * `"i18n"`, translate the contained `spec.spec`, assuming that its
 * `keyPart` is the entire i18n key. */
export function resolveRawOrI18n(
  i18n: i18n,
  spec: RawOrI18nStringSpec
): string {
  switch (spec.kind) {
    case "raw":
      return spec.text;
    case "i18n": {
      const params = resolveIndirectParams(i18n, spec.spec);
      const tOptions = { ns: spec.spec.ns, replace: params };
      return i18n.t(spec.spec.keyPart, tOptions);
    }
    default:
      return assertNever(spec);
  }
}
