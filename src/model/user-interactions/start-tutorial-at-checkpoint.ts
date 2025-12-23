type StartTutorialAtCheckpointRunArgs = {
  mSlug?: string;
  mChapterIndexStr?: string;
};

type ValidatedRunArgs = {
  slug: string;
  chapterIndex: number;
};

type StartTutorialAtCheckpointRunState = ValidatedRunArgs & {
  displayName: string;
  displaySummary: Array<ChildNode>;
};
