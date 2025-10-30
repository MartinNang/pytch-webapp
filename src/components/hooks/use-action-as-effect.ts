import { useEffect } from "react";
import { useStoreActions } from "../../store";
import { IPytchAppModel } from "../../model";
import { Actions } from "easy-peasy";

type ActionsMapper<R extends () => void> = (
  state: Actions<IPytchAppModel>
) => R;

export function useActionAsEffect<R extends () => void>(
  selector: ActionsMapper<R>
) {
  const action = useStoreActions(selector);
  useEffect(() => {
    action();
  });
}
