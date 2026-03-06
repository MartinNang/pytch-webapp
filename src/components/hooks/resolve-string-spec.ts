import { useTranslation } from "react-i18next";
import { RawOrI18nStringSpec } from "../../model/i18n/core-types";
import { resolveRawOrI18n } from "../../model/i18n/utils";

export function useResolveStringSpec() {
  const { i18n } = useTranslation();
  return (spec: RawOrI18nStringSpec): string => resolveRawOrI18n(i18n, spec);
}
