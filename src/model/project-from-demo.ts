import { Action, Thunk, thunk } from "easy-peasy";
import { LinkedContentRef } from "./linked-content-core";
import { projectDescriptor, projectSummary } from "../storage/zipfile";
import { fetchArrayBuffer, propSetterAction } from "../utils";

import { createNewProject, CreateProjectOptions } from "../database/indexed-db";

import { IPytchAppModel } from "./index";
import { ProjectId } from "./project-core";
import { envVarOrFail } from "../env-utils";
import { demoProjectZipfileUrl } from "./discoverable-demos";

type ProjectFromDemoState =
  | { state: "idle" }
  | { state: "fetching" }
  | { state: "creating-project" }
  | { state: "redirecting" }
  | { state: "failed"; message: string };

type SAction<PayloadT = void> = Action<ProjectFromDemoFlow, PayloadT>;

type SThunk<PayloadT = void, ReturnT = void> = Thunk<
  ProjectFromDemoFlow,
  PayloadT,
  unknown,
  IPytchAppModel,
  ReturnT
>;

export type ProjectFromDemoFlow = {
  state: ProjectFromDemoState;
  setState: SAction<ProjectFromDemoState>;
  createProject: SThunk<string, Promise<void>>;
  redirectToProject: Thunk<
    ProjectFromDemoFlow,
    ProjectId,
    void,
    IPytchAppModel,
    void
  >;
};

export let projectFromDemoFlow: ProjectFromDemoFlow = {
  state: { state: "idle" },
  setState: propSetterAction("state"),
  createProject: thunk(async (actions, demoUuid, helpers) => {
    const allActions = helpers.getStoreActions();

    const url = demoProjectZipfileUrl(demoUuid);

    const zipData = await fetchArrayBuffer(url);
    const demoProject = await projectDescriptor(undefined, zipData);

    const linkedContentRef: LinkedContentRef = {
      kind: "demo",
      uuid: demoUuid,
    };

    const creationOptions: CreateProjectOptions = {
      summary: projectSummary(undefined, linkedContentRef),
      program: demoProject.program,
      assets: demoProject.assets,
      linkedContentRef,
    };

    actions.setState({ state: "creating-project" });

    const project = await createNewProject(demoProject.name, creationOptions);
    allActions.projectCollection.noteDatabaseChange();

    actions.redirectToProject(project.id);
  }),
  redirectToProject: thunk((actions, projectId, helpers) => {
    const allActions = helpers.getStoreActions();
    actions.setState({ state: "redirecting" });

    allActions.navigationRequestQueue.enqueue({
      path: `/ide/${projectId}`,
      opts: { replace: false },
    });
  }),
};
