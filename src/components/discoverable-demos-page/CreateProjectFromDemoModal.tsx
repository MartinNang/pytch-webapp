import React from "react";
import { asyncFlowModal } from "../async-flow-modals/utils";
import { useFlowState } from "../../model";
import { GenericWorkingModal } from "../async-flow-modals/GenericWorkingModal";

export const CreateProjectFromDemoModal = () => {
  const fsmState = useFlowState((f) => f.createProjectFromDemoFlow.fsmState);
  return asyncFlowModal(fsmState, () => <GenericWorkingModal />);
};
