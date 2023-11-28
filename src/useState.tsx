import { useMemo, useSyncExternalStore } from "react";
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

	const getState = useMemo(() => state.get.bind(state), []);
	const subscribe = useMemo(() => state.subscribe.bind(state), [])

	return useSyncExternalStore(
		subscribe,
		selector
			? (): TSelectorResult => selector(state.get())
			: getState,
		getState
	)
};

export { useState };
