import { IPytchAppModel } from "..";
import {
  AsyncUserFlowSlice,
} from "./async-user-flow";

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

export type StartTutorialAtCheckpointFlow = AsyncUserFlowSlice<
  IPytchAppModel,
  StartTutorialAtCheckpointRunArgs,
  StartTutorialAtCheckpointRunState
>;
