import { useEffect } from "react";
import { Event } from "svitore";

const useListener = <T>(
	event: Event<T>,
	subscriber: (payload: T) => void
): void => {
	useEffect(() => {
		return event.subscribe((payload) => subscriber(payload));
	}, []);
};

export { useListener };
