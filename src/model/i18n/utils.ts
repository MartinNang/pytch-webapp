import { i18n, TOptions } from "i18next";
import {
  I18nStringSpec,
  I18nStringSpecWithKeyPart,
  RawOrI18nStringSpec,
} from "./core-types";
import { assertNever } from "../../utils";

export function i18nTranslationOptions(
  i18n: i18n,
  spec: I18nStringSpec
): TOptions {
  let resolvedParams = { ...spec.params };

  if (spec.indirectParams) {
    for (const [paramName, fqKey] of Object.entries(spec.indirectParams)) {
      if (paramName in resolvedParams) {
        console.error(`indirect param "${paramName}" already exists in params`);
      } else {
        // It would be nice if we could get rid of this "as any" but
        // nothing obvious is coming to mind, since the values are
        // dynamic.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = i18n.t(fqKey.key as any, { ns: fqKey.ns });
        resolvedParams[paramName] = value;
      }
    }
  }

  let tOptions: TOptions = { ns: spec.ns, replace: resolvedParams };

  // If "count" is a parameter, it needs to exist as its own option for
  // key selection, as well as be part of the "replace" option to be
  // substituted in the translated string.
  if (Object.hasOwn(resolvedParams, "count")) {
    tOptions.count = resolvedParams.count;
  }

  return tOptions;
}

export function translatedSpec(
  i18n: i18n,
  spec: I18nStringSpecWithKeyPart
): string {
  return i18n.t(spec.keyPart, i18nTranslationOptions(i18n, spec));
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
      return translatedSpec(i18n, spec.spec);
    }
    default:
      return assertNever(spec);
  }
}
