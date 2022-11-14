import { useSyncExternalStore } from "react";
import { State } from "svitore";

const useState = <
	TState extends State<any>,
	TStateData = ReturnType<TState["get"]>,
	TSelectorResult = void
>(
	state: TState,
	selector?: (state: TStateData) => TSelectorResult
): TSelectorResult extends void ? TStateData : TSelectorResult =>
	useSyncExternalStore(
		state.subscribe.bind(state),
		selector ? () => selector(state.get()) : state.get.bind(state)
	);

export { useState };
