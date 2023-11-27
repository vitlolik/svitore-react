import { useCallback } from "react";
import { AbstractEvent } from "svitore";

import { useSvitoreContext } from "./Context";

type Dispatch<T> = T extends void ? () => void : (payload: T) => void;

const useEvent = <T>(event: AbstractEvent<T>): Dispatch<T> => {
	event =
		(useSvitoreContext()?.get(event) as AbstractEvent<T> | undefined) ?? event;

	const dispatch = useCallback((payload: T): void => {
		event.dispatch(payload);
	}, []);

	return dispatch as Dispatch<T>;
};

export { useEvent };
