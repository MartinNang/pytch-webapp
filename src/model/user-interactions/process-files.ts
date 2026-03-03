import { RawOrI18nStringSpec } from "../i18n/core-types";

export type FileProcessingFailure = {
  filename: string;
  reason: RawOrI18nStringSpec;
};

export class FileFailureError extends Error {
  constructor(readonly fileFailures: Array<FileProcessingFailure>) {
    super("There was a problem when processing a file or files");
  }
}
