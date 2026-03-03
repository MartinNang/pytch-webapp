import { RawOrI18nStringSpec } from "../i18n/core-types";

export type FileProcessingFailure = {
  filename: string;
  reason: RawOrI18nStringSpec;
};
