import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityContentState,
  ActivityBarTabKey,
} from "../../model/junior/edit-state";
import { useJrEditActions, useJrEditState } from "./hooks";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-common-types";
import { useHasLinkedLesson, useHasLinkedSpecimen } from "./lesson/hooks";
import { EmptyProps } from "../../utils";
import { useStoreState } from "../../store";
import { Nav } from "react-bootstrap";
import { kFocusGroupItemClassName } from "../../model/junior/grouped-focus";
import { useFocusContext } from "../hooks/focus-steering";
import { FocusGroupContainer } from "../FocusGroupContainer";

type TabKeyUiDetails = { icon: IconName; tooltip: string; label: string };

const uiDetailsFromTabKeyLut = new Map<ActivityBarTabKey, TabKeyUiDetails>([
  [
    "helpsidebar",
    {
      icon: "code",
      tooltip: "Scratch/Python help",
      label: "Reference",
    },
  ],
  [
    "keynavhelp",
    {
      icon: "keyboard",
      tooltip: "Keyboard navigation help",
      label: "Shortcuts",
    },
  ],
  ["lesson", { icon: "book", tooltip: "Lesson content", label: "Lesson" }],
  [
    "tutorial",
    { icon: "book", tooltip: "Tutorial content", label: "Tutorial" },
  ],
  [
    "specimen",
    { icon: "book", tooltip: "Lesson information", label: "Lesson" },
  ],
  [
    "ideoverview",
    { icon: "fa-grid-horizontal", tooltip: "IDE overview", label: "Overview" },
  ],
]);

function uiDetailsFromTabKey(tab: ActivityBarTabKey): TabKeyUiDetails {
  const mDetails = uiDetailsFromTabKeyLut.get(tab);
  if (mDetails == null) {
    throw new Error(`unrecognised tab-key name "${tab}"`);
  }
  return mDetails;
}

const tabIsActive = (
  tab: ActivityBarTabKey,
  contentState: ActivityContentState
) => contentState.kind === "expanded" && contentState.tab === tab;

type ActivityBarTabProps = { tab: ActivityBarTabKey; isActive: boolean };
const ActivityBarTab: React.FC<ActivityBarTabProps> = ({ tab, isActive }) => {
  const { t } = useTranslation("ide");
  const focusContext = useFocusContext();

  const collapseAction = useJrEditActions((a) => a.collapseActivityContent);
  const expandAction = useJrEditActions((a) => a.expandActivityContent);

  const onClick = isActive ? () => collapseAction() : () => expandAction(tab);
  const uiDetails = uiDetailsFromTabKey(tab);
  const classes = classNames("ActivityBarTab p-0", `tab-key-${tab}`);
  const buttonClasses = classNames("mb-2 w-100", kFocusGroupItemClassName);

  return (
    <li className={classes} onClick={onClick}>
      <button
        className={buttonClasses}
        tabIndex={-1}
        onClick={focusContext.onGroupItemClick}
        id={`pytch:activity-bar-tab:tab:${tab}`}
        role="tab"
        aria-label={uiDetails.label}
        aria-controls={`pytch:activity-bar-tab:tabpanel:${tab}`}
        aria-selected={isActive}
        data-activity-bar-tab={tab}
      >
        <div className={classNames("tabkey-icon-wrapper", { isActive })}>
          <FontAwesomeIcon
            icon={
              uiDetails.icon === "python"
                ? "fa-brands fa-python"
                : uiDetails.icon
            }
            className={classNames("tabkey-icon", { isActive })}
          />
        </div>
        <p
          className={classNames("pt-1 activity-bar-tab-label", {
            isActive,
          })}
        >
          {uiDetails.label}
        </p>
      </button>
      <div className="tabkey-tooltip">{t(`activity-bar.tooltip.${tab}`)}</div>
    </li>
  );
};

export const ActivityBar: React.FC<EmptyProps> = () => {
  const activityContentState = useJrEditState((s) => s.activityContentState);
  const pendingActionsExist = useStoreState(
    (s) => s.activeProject.pendingSyncActionsExist
  );

  // TODO: Should the computation of the list of valid activity-tab-keys
  // be part of the model?  See also other places where these facts are represented:
  //
  // IDELayout component
  // Thunks bootForFlatProgram() and bootForProgram() in EditState

  const hasLinkedLesson = useHasLinkedLesson();
  const hasLinkedSpecimen = useHasLinkedSpecimen();
  const hasLinkedTutorial = useStoreState(
    (state) => state.activeProject.project?.trackedTutorial != null
  );

  const tabs: Array<ActivityBarTabKey> = hasLinkedLesson
    ? ["ideoverview", "helpsidebar", "lesson", "keynavhelp"]
    : hasLinkedSpecimen
    ? ["ideoverview", "helpsidebar", "specimen", "keynavhelp"]
    : hasLinkedTutorial
    ? ["ideoverview", "helpsidebar", "tutorial", "keynavhelp"]
    : ["ideoverview", "helpsidebar", "keynavhelp"];

  const focusGroupExtraClass =
    activityContentState.kind === "collapsed" ? "gfs__help__container" : "";
  const syncClasses = classNames("sync-indicator", { pendingActionsExist });
  return (
    <FocusGroupContainer
      className={focusGroupExtraClass}
      groupedFocusKey="ActivityBar"
    >
      <div className="ActivityBar" role={"menubar"}>
        <Nav
          as="ul"
          className="activity-bar-tabs d-flex justify-content-center"
        >
          {tabs.map((tab) => (
            <ActivityBarTab
              key={tab}
              tab={tab}
              isActive={tabIsActive(tab, activityContentState)}
            />
          ))}
        </Nav>
        <div className={syncClasses}>
          <FontAwesomeIcon icon="arrows-rotate" />
        </div>
      </div>
    </FocusGroupContainer>
  );
};
