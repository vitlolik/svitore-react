import { useSyncExternalStore } from "react";
import { AbstractState } from "svitore";
import { useSvitoreContext } from './Context';

const useState = <
	TState extends AbstractState<any>,
	TStateData = ReturnType<TState["get"]>,
	TSelectorResult = void
>(
	state: TState,
	selector?: (state: TStateData) => TSelectorResult
): TSelectorResult extends void ? TStateData : TSelectorResult => {
	state = useSvitoreContext()?.get(state) as TState | undefined ?? state

	return useSyncExternalStore(
		state.subscribe.bind(state),
		selector
			? (): TSelectorResult => selector(state.get())
			: state.get.bind(state)
	)
};

export { useState };
