import React, { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { useStoreActions, useStoreState } from "../store";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyProps } from "../utils";
import { filenameFormatSpecifier } from "../model/format-spec-for-linked-content";
import { pathWithinApp } from "../env-utils";
import { useNavigate } from "react-router-dom";
import { useRunFlow } from "../model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Sk: any;

export const focusStage = () => {
  document.getElementById("pytch-speech-bubbles")?.focus();
};

const StaticTooltip: React.FC<PropsWithChildren<{ visible: boolean }>> = ({
  children,
  visible,
}) => {
  const visibilityClass = visible ? "shown" : "hidden";

  return (
    <div className={`pytch-static-tooltip ${visibilityClass}`}>
      <div className="spacer" />
      <div className="content">
        <FontAwesomeIcon className="fa-2x" icon="info-circle" />
        <div className="inner-content">{children}</div>
      </div>
    </div>
  );
};

const GreenFlag = () => {
  const { t } = useTranslation("ide");
  const buttonTourProgressStage = useStoreState(
    (state) => state.ideLayout.buttonTourProgressStage
  );
  const build = useStoreActions((actions) => actions.activeProject.build);

  const handleClick = () => build("running-project");

  const tooltipIsVisible = buttonTourProgressStage === "green-flag";

  return (
    <div className="tooltipped-elt">
      <Button
        className="StageControlPseudoButton GreenFlag"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon="play" />
      </Button>
      <StaticTooltip visible={tooltipIsVisible}>
        <p>{t("tooltip.green-flag")}</p>
      </StaticTooltip>
    </div>
  );
};

export const RedStop = () => {
  const redStop = () => {
    Sk.pytch.current_live_project.on_red_stop_clicked();
    focusStage();
  };
  return (
    <Button className="StageControlPseudoButton RedStop" onClick={redStop}>
      <FontAwesomeIcon icon="stop" />
    </Button>
  );
};

const ExportToDriveDropdownItem: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("projects");
  const linkedContentLoadingState = useStoreState(
    (state) => state.activeProject.linkedContentLoadingState
  );
  const project = useStoreState((state) => state.activeProject.project);
  const launchExportProjectOperation = useStoreActions(
    (actions) => actions.googleDriveImportExport.exportProject
  );
  const onExport = () => {
    launchExportProjectOperation({ project, linkedContentLoadingState });
  };

  const googleDriveStatus = useStoreState(
    (state) => state.googleDriveImportExport.apiBootStatus
  );

  switch (googleDriveStatus.kind) {
    case "not-yet-started":
    case "pending":
      return (
        <Dropdown.Item disabled>{t("export-to-google-drive")}</Dropdown.Item>
      );
    case "succeeded":
      return (
        <Dropdown.Item onClick={onExport}>
          {t("export-to-google-drive")}
        </Dropdown.Item>
      );
    case "failed":
      return (
        <Dropdown.Item disabled>{t("google-drive-unavailable")}</Dropdown.Item>
      );
  }
};

const LaunchCoordsChooserDropdownItem: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("ide");
  const setCoordsChooserState = useStoreActions(
    (actions) => actions.ideLayout.coordsChooser.setStateKind
  );
  const launchCoordsChooser = () => setCoordsChooserState("active");

  return (
    <Dropdown.Item onClick={launchCoordsChooser}>
      {t("project-action.show-coords")}
    </Dropdown.Item>
  );
};

const GoToMyProjectsDropdownItem: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("projects");
  const navigate = useNavigate();
  const goToMyProjects = () => navigate(pathWithinApp("/my-projects/"));
  return (
    <Dropdown.Item onClick={goToMyProjects}>{t("page-heading")}</Dropdown.Item>
  );
};

export const StageControls: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("ide");
  const navigate = useNavigate();
  const isFullScreen = useStoreState(
    (state) => state.ideLayout.fullScreenState.isFullScreen
  );
  const linkedContentLoadingState = useStoreState(
    (state) => state.activeProject.linkedContentLoadingState
  );
  const { project, codeStateVsStorage } = useStoreState(
    (state) => state.activeProject
  );
  const { requestSyncToStorage } = useStoreActions(
    (actions) => actions.activeProject
  );
  const setIsFullScreen = useStoreActions(
    (actions) => actions.ideLayout.setIsFullScreen
  );

  const handleSave = () => requestSyncToStorage();

  const runDisplayScreenshot = useRunFlow((f) => f.displayScreenshotFlow);
  const onScreenshot = () => runDisplayScreenshot();

  const runDownloadZipfiles = useRunFlow((f) => f.downloadZipfileFlow);
  const formatSpecifier = filenameFormatSpecifier(linkedContentLoadingState);
  const onDownload = () => runDownloadZipfiles({ project, formatSpecifier });

  const initiateButtonTour = useStoreActions(
    (actions) => actions.ideLayout.initiateButtonTour
  );
  const onShowTooltips = () => initiateButtonTour();

  const runSaveProjectAs = useRunFlow((f) => f.saveProjectAsFlow);
  const copyArgs = {
    sourceProjectId: project.id,
    sourceName: project.name,
    sourceLinkedContentRef: project.linkedContentRef,
  };
  const onCreateCopy = () => runSaveProjectAs(copyArgs);

  const fullScreenButton = (
    <Button className="full-screen" onClick={() => setIsFullScreen(true)}>
      <FontAwesomeIcon className="fa-lg" icon="expand" />
    </Button>
  );

  const goHome = () => navigate(pathWithinApp("/"));

  return isFullScreen ? (
    <section
      className="StageControls"
      aria-label={t("stage-controls.aria-label")}
    >
      <div className="run-stop-controls">
        <GreenFlag />
        <RedStop />
      </div>
      <Button
        className="leave-full-screen"
        variant={"secondary"}
        onClick={() => setIsFullScreen(false)}
      >
        <FontAwesomeIcon className="fa-lg" icon="compress" />
      </Button>
    </section>
  ) : (
    <section
      className="StageControls"
      aria-label={t("stage-controls.aria-label")}
    >
      <GreenFlag />
      <RedStop />
      <Button
        className={`save-button ${codeStateVsStorage}`}
        onClick={handleSave}
      >
        <span>{t("project-action.save")}</span>
      </Button>
      {fullScreenButton}
      <Button onClick={goHome}>
        <FontAwesomeIcon aria-label={t("home-button.aria-label")} icon="home" />
      </Button>
      <DropdownButton align="end" title="⋮">
        <GoToMyProjectsDropdownItem />
        <Dropdown.Item onClick={onScreenshot}>
          {t("project-action.screenshot")}
        </Dropdown.Item>
        <Dropdown.Item onClick={onCreateCopy}>
          {t("project-action.make-copy")}
        </Dropdown.Item>
        <Dropdown.Item onClick={onDownload}>
          {t("project-action.download-zip")}
        </Dropdown.Item>
        <ExportToDriveDropdownItem />
        <LaunchCoordsChooserDropdownItem />
        <Dropdown.Item onClick={onShowTooltips}>
          {t("project-action.show-tooltips")}
        </Dropdown.Item>
      </DropdownButton>
    </section>
  );
};
