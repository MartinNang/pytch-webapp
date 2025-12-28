import React, { KeyboardEventHandler, useEffect } from "react";
import classNames from "classnames";
import { useStoreActions, useStoreState } from "../store";
import { useJrEditState } from "./Junior/hooks";
import { assertNever, EmptyProps } from "../utils";
import { DivSettingWindowTitle } from "./DivSettingWindowTitle";
import { ActivityPane } from "./Junior/ActivityPane";
import { EditorAndOutErr } from "./EditorAndOutErr";
import { StageAndActorsOrAssets } from "./StageAndActorsOrAssets";
import { FullScreenLayout } from "./FullScreenLayout";
import { Modals as PerMethodModals } from "./Junior/Modals";
import { FlatModals } from "./FlatModals";
import { useFocusContext } from "./hooks/focus-steering";
import { NotableChangeToasts } from "./NotableChangeToasts";
import { useActionAsEffect } from "./hooks/use-action-as-effect";
import {Group, Panel, PanelSize, Separator} from "react-resizable-panels";
import {minStageWidth} from "./Junior/WidthMonitor";
import { stageWidth } from "../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Modals: React.FC<EmptyProps> = () => {
  const programKind = useStoreState(
    (state) => state.activeProject.project.program.kind
  );
  switch (programKind) {
    case "flat":
      return <FlatModals />;
    case "per-method":
      return <PerMethodModals />;
    default:
      return assertNever(programKind);
  }
};

export const IDELayout: React.FC<EmptyProps> = () => {
  const focusContext = useFocusContext();
  const projectId = useStoreState((state) => state.activeProject.project.id);
  const projectName = useStoreState(
    (state) => state.activeProject.project.name
  );
  const activityContentFullStateLabel = useJrEditState(
    (s) => s.activityContentFullStateLabel
  );
  const isFullScreen = useStoreState(
    (state) => state.ideLayout.fullScreenState.isFullScreen
  );

  useActionAsEffect((actions) => actions.reloadServer.maybeConnect);

  // Even though we refer to activityContentFullStateLabel, we only want
  // to set the bookmark on initial render; hence empty deps array.
  useEffect(() => {
    // TODO: The facts about which activities are present and which one
    // is active when booted are spread across the code.  Here, and in
    // (junior) `EditState.bootForProgram()`.  Would be good to tidy
    // this up somehow.
    const defaultBookmark = (() => {
      switch (activityContentFullStateLabel) {
        case "collapsed":
        case "expanded-helpsidebar":
          return 0;
        case "expanded-specimen":
        case "expanded-lesson":
        case "expanded-tutorial":
          return 1;
        case "expanded-keynavhelp":
          console.warn("should not have expanded-keynavhelp on first render");
          // But return something non-erroneous anyway.
          return 0;
        default:
          return assertNever(activityContentFullStateLabel);
      }
    })();

    focusContext.bookmarkItemByKeyAndIndex("ActivityBar", defaultBookmark);
  }, []);

  if (isFullScreen) {
    return <FullScreenLayout />;
  }

  const classes = classNames(
    "IDELayout",
    "abs-0000",
    `activity-content-${activityContentFullStateLabel}`
  );

  const mainOnKeyDown: KeyboardEventHandler = (evt) => {
    const tgtElt = evt.target as HTMLElement;
    const tgtTag = tgtElt.tagName ?? "--UNKNOWN--";

    switch (tgtTag) {
      case "TEXTAREA":
      case "INPUT":
        return;
    }

    // Any way to not couple this so tightly?
    if (tgtElt.id === "pytch-speech-bubbles") {
      return;
    }

    const now = Date.now() / 1000.0; // In units of seconds
    const keyOutcome = focusContext.onKeyDown(evt.key, now);
    if (keyOutcome === "triggered-action") {
      evt.preventDefault();
    }
  };

  const setStageDisplayWidth = useStoreActions(
    (actions) => actions.ideLayout.setStageDisplayWidth
  );

  return (
    <DivSettingWindowTitle
      className={classes}
      windowTitle={`Pytch: ${projectName}`}
      data-project-id={projectId}
    >
      <Modals />
      <NotableChangeToasts />
      <main tabIndex={-1} onKeyDown={mainOnKeyDown}>
        <Group className={"resizablePanels"}>
          <Panel minSize={260}>
            <ActivityPane />
          </Panel>
          <Separator className={"horizontalSeparator customSeparator d-flex justify-content-center align-items-center"}>
            <FontAwesomeIcon icon={"ellipsis-v"} className={"separatorIcon"} />
          </Separator>
          <Panel minSize={300}>
            <EditorAndOutErr />
          </Panel>
          <Separator className={"horizontalSeparator customSeparator d-flex justify-content-center align-items-center"}>
              <FontAwesomeIcon icon={"ellipsis-v"} className={"separatorIcon"} />
          </Separator>
          <Panel minSize={minStageWidth + 20} maxSize={500}
                 onResize={
                   ((panelSize: PanelSize) => {
                     //TODO update stage width
                     const targetWidth = Math.min(
                         stageWidth,
                         Math.max(minStageWidth, panelSize.inPixels - 20)
                     );
                     setStageDisplayWidth(targetWidth);
                   })}>
            <StageAndActorsOrAssets/>
          </Panel>
        </Group>
      </main>
    </DivSettingWindowTitle>
  );
};
