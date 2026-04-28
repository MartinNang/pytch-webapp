import { Actions, State } from "easy-peasy";
import { IDiscoverableDemos } from "../../model/discoverable-demos";
import { useStoreActions, useStoreState } from "../../store";

type DemoListStateMapper<R> = (state: State<IDiscoverableDemos>) => R;
type DemoListActionsMapper<R> = (actions: Actions<IDiscoverableDemos>) => R;

export function useDemoListState<R>(mapState: DemoListStateMapper<R>): R {
  return useStoreState((state) => mapState(state.discoverableDemos));
}

export function useDemoListActions<R>(mapActions: DemoListActionsMapper<R>): R {
  return useStoreActions((actions) => mapActions(actions.discoverableDemos));
}
