import React from "react";
import { assertNever, EmptyProps } from "../../../utils";
import { useMappedLinkedJrTutorial } from "./hooks";
import { useStoreActions, useStoreState } from "../../../store";
import {
  JrTutorialChapterTitle,
  LinkedJrTutorial,
  allTasksDoneInCurrentChapter,
} from "../../../model/junior/jr-tutorial";
import {
  ChapterNavigationButtons,
  ChapterNavigationButtonsProps,
} from "./ChapterNavigationButtons";
import { useTranslation } from "react-i18next";

type ChapterNavigationState = {
  allChapterTasksDone: boolean;
  chapterIdx: number;
  mNextChapterTitle: JrTutorialChapterTitle | null;
  nChapters: number;
};

function mapTutorial(tutorial: LinkedJrTutorial): ChapterNavigationState {
  const allChapterTasksDone = allTasksDoneInCurrentChapter(tutorial);
  const chapterIdx = tutorial.interactionState.chapterIndex;
  const nChapters = tutorial.content.chapters.length;
  const mNextChapterTitle =
    chapterIdx === nChapters - 1
      ? null
      : tutorial.content.chapters[chapterIdx + 1].title;
  return { allChapterTasksDone, chapterIdx, mNextChapterTitle, nChapters };
}

function eqState(
  s1: ChapterNavigationState,
  s2: ChapterNavigationState
): boolean {
  return (
    s1.allChapterTasksDone === s2.allChapterTasksDone &&
    s1.chapterIdx === s2.chapterIdx &&
    s1.mNextChapterTitle === s2.mNextChapterTitle &&
    s1.nChapters === s2.nChapters
  );
}

export const ChapterNavigation: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("tutorials");
  const state = useMappedLinkedJrTutorial(mapTutorial, eqState);
  const allowRandomChapterAccess = useStoreState(
    (state) => state.tutorialCollection.allowRandomChapterAccess
  );
  const setChapterIndex = useStoreActions(
    (actions) => actions.activeProject.setLinkedLessonChapterIndex
  );

  if (!state.allChapterTasksDone && !allowRandomChapterAccess) return null;

  let props: ChapterNavigationButtonsProps = {};
  if (state.mNextChapterTitle != null) {
    const title = state.mNextChapterTitle;
    const displayTitle = (() => {
      switch (title.kind) {
        case "html":
          return title.elt.innerText;
        case "i18nKey":
          return t(title.key);
        default:
          return assertNever(title);
      }
    })();

    props.next = {
      displayTitle,
      navigate: () => setChapterIndex(state.chapterIdx + 1),
    };
  }

  return <ChapterNavigationButtons {...props} />;
};
