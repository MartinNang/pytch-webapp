// The "replace" options is type as "any"; try something a bit richer.
export type I18nParams = Record<string, unknown> & { count?: number };

type I18nFullyQualifiedKey = { ns: string; key: string };

// keyPart here is because this type might be used in contexts where
// there are other parts to the key.  In some contexts it might be an
// error for keyPart to be null.  We might need to revisit this.
export type I18nStringSpec = {
  keyPart: string | null;
  params?: I18nParams;
  indirectParams?: Record<string, I18nFullyQualifiedKey>;
  ns: string;
};

