import {
	createElement,
	FunctionComponent,
	useEffect,
	useState,
	memo,
	useRef,
	useMemo,
} from "react";
import { State, Event, ComputeState } from "svitore";

type BaseProps = Record<string, any>;

type EntitiesPayload<T extends BaseProps> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any
		? Event<Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]>
		: State<T[K]>;
};

type StateList<Props> = { key: keyof Props; state: State<any> }[];

const getBoundState = <Props extends BaseProps>(
	stateList: StateList<Props>
): BaseProps => {
	const result: any = {};

	for (const stateItem of stateList) {
		result[stateItem.key] = stateItem.state.get();
	}

	return result;
};

const parsePayload = <Props extends BaseProps>(
	payload: EntitiesPayload<Props>,
	propsKeys: string
): {
	stateList: {
		key: keyof Props;
		state: State<any>;
	}[];
	boundEvents: any;
} => {
	const stateList: { key: keyof Props; state: State<any> }[] = [];
	const boundEvents = {} as any;
	const propsKeysList = propsKeys.split(",");

	for (const key in payload) {
		if (propsKeysList.includes(key)) continue;

		const entity = payload[key];
		if (entity instanceof State) {
			stateList.push({ key, state: entity });
		} else if (entity instanceof Event) {
			boundEvents[key] = (param: any) => entity.dispatch(param);
		}
	}

	return { stateList, boundEvents };
};

const usePreviousProps = <Props extends BaseProps>(
	props: Props
): Props | undefined => {
	const ref = useRef<Props>();

	useEffect(() => {
		ref.current = props;
	});

	return ref.current;
};

const getConnectedComponentName = (Component: FunctionComponent<any>): string =>
	`svitore(${Component.displayName || Component.name})`;

const getPropsKeysAsString = <Props extends BaseProps>(
	props: Partial<Props>
): string => {
	let keys = "";

	for (const key in props) {
		if (props[key] !== undefined) {
			keys += key + ",";
		}
	}

	return keys;
};

const connect = <Props extends BaseProps>(
	Component: FunctionComponent<Props>,
	payload: EntitiesPayload<Props>,
	events?: {
		onMount?: (props: Props) => void;
		onUnMount?: (props: Props) => void;
		onUpdate?: (props: Props, prevProps: Props | undefined) => void;
	}
): FunctionComponent<Partial<Props>> => {
	const Connected = memo<Partial<Props>>((props) => {
		const propsKeys = getPropsKeysAsString(props);
		const { stateList, boundEvents } = useMemo(
			() => parsePayload(payload, propsKeys),
			[propsKeys]
		);
		const [boundState, updateState] = useState(() => getBoundState(stateList));
		const mergedProps: Props = { ...boundState, ...boundEvents, ...props };
		const isInitialMountRef = useRef(true);
		const propsRef = useRef<Props>(mergedProps);
		const prevProps = usePreviousProps(mergedProps);

		propsRef.current = mergedProps;

		if (events?.onMount || events?.onUnMount) {
			useEffect(() => {
				events.onMount?.(propsRef.current);

				return () => events.onUnMount?.(propsRef.current);
			}, []);
		}

		useEffect(() => {
			const computeState = new ComputeState(
				...stateList.map(({ state }) => state),
				() => ({})
			);

			computeState.subscribe(() => updateState(getBoundState(stateList)));

			return () => computeState.release();
		}, [stateList]);

		if (events?.onUpdate) {
			useEffect(
				() => {
					if (isInitialMountRef.current) {
						isInitialMountRef.current = false;
					} else {
						events.onUpdate?.(propsRef.current, prevProps);
					}
				},
				Object.keys(mergedProps).map((prop) => mergedProps[prop])
			);
		}

		return createElement(Component, mergedProps);
	});

	Connected.displayName = getConnectedComponentName(Component);

	return Connected;
};

export { connect };
