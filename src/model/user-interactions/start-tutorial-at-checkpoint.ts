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

function validatedArgs(
  args: StartTutorialAtCheckpointRunArgs
): ValidatedRunArgs {
  const slug = args.mSlug;
  if (slug == null) throw new Error("no tutorial slug found in parameters");

  const chapterIndex = parseInt(args.mChapterIndexStr ?? "");
  if (isNaN(chapterIndex))
    throw new Error("no/bad chapter index found in parameters");

  return { slug, chapterIndex };
}
