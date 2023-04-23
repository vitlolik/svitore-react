import {
	createElement,
	FunctionComponent,
	useEffect,
	useState,
	memo,
	useRef,
} from "react";
import { State, Event, Reaction } from "svitore";

type BaseProps = Record<string, any>;

type EntitiesPayload<T extends BaseProps> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any
		? Event<Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]>
		: State<T[K]>;
};

type StateList<Props> = { key: keyof Props; state: State<any> }[];

const getBoundState = <Props extends BaseProps>(
	stateList: StateList<Props>
): BaseProps =>
	stateList.reduce<Record<keyof Props, any>>((result, item) => {
		result[item.key] = item.state.get();

		return result;
	}, {} as any);

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

const connect = <Props extends BaseProps>(
	Component: FunctionComponent<Props>,
	payload: EntitiesPayload<Props>,
	events?: {
		onMount?: (props: Props) => void;
		onUnMount?: (props: Props) => void;
		onUpdate?: (props: Props, prevProps: Props | undefined) => void;
	}
): FunctionComponent<Partial<Props>> => {
	const stateList: { key: keyof Props; state: State<any> }[] = [];
	const boundEvents = {} as any;

	for (const key in payload) {
		const entity = payload[key];
		if (entity instanceof State) {
			stateList.push({ key, state: entity });
		} else if (entity instanceof Event) {
			boundEvents[key] = (param: any) => entity.dispatch(param);
		}
	}

	const Connected = memo<Partial<Props>>((props) => {
		const [boundState, updateState] = useState(() => getBoundState(stateList));
		const mergedProps: Props = { ...boundState, ...boundEvents, ...props };
		const isInitialMountRef = useRef(true);
		const propsRef = useRef<Props>(mergedProps);
		const prevProps = usePreviousProps(mergedProps);

		propsRef.current = mergedProps;

		useEffect(() => {
			const reaction = new Reaction(
				...stateList.map(({ state }) => state),
				() => updateState(getBoundState(stateList))
			);
			events?.onMount?.(propsRef.current);

			return () => {
				events?.onUnMount?.(propsRef.current);
				reaction.release();
			};
		}, []);

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
