// import {
// 	createElement,
// 	FunctionComponent,
// 	useEffect,
// 	useState,
// 	memo,
// 	useRef,
// 	useMemo,
// } from "react";
// import { AbstractState, Event, ComputedState } from "svitore";

// type BaseProps = Record<string, any>;

// type EntitiesPayload<T extends BaseProps> = Partial<{
// 	[K in keyof T]: T[K] extends (...args: any[]) => any
// 		? Event<Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]>
// 		: AbstractState<T[K]>;
// }>;

// type ExtractEntityTypes<T> = {
// 	[K in keyof T]: T[K] extends AbstractState<infer U>
// 		? U
// 		: T[K] extends Event<infer U>
// 		? (payload: U) => void
// 		: never;
// };

// type MergeObjects<T, U> = Partial<Pick<T & U, keyof T & keyof U>> &
// 	Omit<T & U, keyof T & keyof U>;

// type StateList<Props> = { key: keyof Props; state: AbstractState<any> }[];

// const getBoundState = <Props extends BaseProps>(
// 	stateList: StateList<Props>
// ): BaseProps => {
// 	const result: any = {};

// 	for (const stateItem of stateList) {
// 		result[stateItem.key] = stateItem.state.get();
// 	}

// 	return result;
// };

// const parsePayload = <Props extends BaseProps>(
// 	payload: EntitiesPayload<Props>,
// 	propsKeys: string
// ): {
// 	stateList: {
// 		key: keyof Props;
// 		state: AbstractState<any>;
// 	}[];
// 	boundEvents: any;
// } => {
// 	const stateList: { key: keyof Props; state: AbstractState<any> }[] = [];
// 	const boundEvents = {} as any;
// 	const propsKeysList = propsKeys.split(",");

// 	for (const key in payload) {
// 		if (propsKeysList.includes(key)) continue;

// 		const entity = payload[key];
// 		if (entity instanceof AbstractState) {
// 			stateList.push({ key, state: entity });
// 		} else if (entity instanceof Event) {
// 			boundEvents[key] = (param: any) => entity.dispatch(param);
// 		}
// 	}

// 	return { stateList, boundEvents };
// };

// const usePreviousProps = <Props extends BaseProps>(
// 	props: Props
// ): Props | undefined => {
// 	const ref = useRef<Props>();

// 	useEffect(() => {
// 		ref.current = props;
// 	});

// 	return ref.current;
// };

// const getComponentName = (Component: FunctionComponent<any>): string =>
// 	`svitore(${Component.displayName || Component.name})`;

// const getPropsKeysAsString = <Props extends BaseProps>(
// 	props: Partial<Props>
// ): string => {
// 	let keys = "";

// 	for (const key in props) {
// 		if (props[key] !== undefined) {
// 			keys += key + ",";
// 		}
// 	}

// 	return keys;
// };

// const connect = <
// 	Props extends BaseProps,
// 	MapStatePayload extends EntitiesPayload<Props>
// >(
// 	Component: FunctionComponent<Props>,
// 	payload: MapStatePayload,
// 	events?: {
// 		onMount?: (props: Props) => void;
// 		onUnMount?: (props: Props) => void;
// 		onUpdate?: (props: Props, prevProps: Props | undefined) => void;
// 	}
// ): FunctionComponent<
// 	MergeObjects<Props, ExtractEntityTypes<MapStatePayload>>
// > => {
// 	const Connected = memo<
// 		MergeObjects<Props, ExtractEntityTypes<MapStatePayload>>
// 	>((props) => {
// 		const propsKeys = getPropsKeysAsString(props);
// 		const { stateList, boundEvents } = useMemo(
// 			() => parsePayload(payload, propsKeys),
// 			[propsKeys]
// 		);
// 		const [boundState, updateState] = useState(() => getBoundState(stateList));
// 		const mergedProps: Props = Object.assign(
// 			{},
// 			boundState,
// 			boundEvents,
// 			props
// 		);
// 		const propsRef = useRef(mergedProps);
// 		propsRef.current = mergedProps;

// 		if (events?.onMount || events?.onUnMount) {
// 			useEffect(() => {
// 				events.onMount?.(propsRef.current);

// 				return () => events.onUnMount?.(propsRef.current);
// 			}, []);
// 		}

// 		useEffect(() => {
// 			const computeState = new ComputedState(
// 				...stateList.map(({ state }) => state),
// 				() => ({})
// 			);

// 			computeState.subscribe(() => updateState(getBoundState(stateList)));

// 			return () => computeState.release();
// 		}, [stateList]);

// 		if (events?.onUpdate) {
// 			const isInitialMountRef = useRef(true);
// 			const prevProps = usePreviousProps(mergedProps);

// 			useEffect(
// 				() => {
// 					if (isInitialMountRef.current) {
// 						isInitialMountRef.current = false;
// 					} else {
// 						events.onUpdate?.(propsRef.current, prevProps);
// 					}
// 				},
// 				Object.keys(mergedProps).map((prop) => mergedProps[prop])
// 			);
// 		}

// 		return createElement(Component, mergedProps);
// 	});

// 	Connected.displayName = getComponentName(Component);

// 	return Connected;
// };

// export { connect };
