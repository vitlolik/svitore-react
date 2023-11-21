import { useEffect } from "react";
import { Event, State } from "svitore";

type CreateConnectionReturn<Props> = {
	useConnection: (props: Props) => void;
	connection: {
		state: State<Props | undefined>;
		mounted: Event<Props>;
		unmounted: Event<Props>;
	};
	release: () => void;
};

const createConnection = <Props>(): CreateConnectionReturn<Props> => {
	const mounted = new Event<Props>();
	const changed = new Event<Props>();
	const unmounted = new Event<Props>();
	const state = new State<Props | undefined>(undefined)
		.changeOn(mounted)
		.changeOn(changed)
		.changeOn(unmounted);

	const connection = {
		state,
		mounted,
		unmounted,
	};

	const useConnection = (props: Props): void => {
		useEffect(() => {
			mounted.dispatch(props);

			return () => {
				unmounted.dispatch(state.get() as Props);
			};
		}, []);

		useEffect(() => {
			changed.dispatch(props);
		}, [props]);
	};

	const release = (): void => {
		mounted.release();
		changed.release();
		unmounted.release();
		state.release();
	};

	return { useConnection, connection, release };
};

export { createConnection };
