import { State, Event, ComputeState } from "svitore";

const increment = new Event();
const reset = new Event();
const changeInput = new Event<string>();

const state = new State({ count: 0, input: "" });

const countState = new ComputeState(state, ({ count }) => count);
const inputState = new ComputeState(state, ({ input }) => input);

increment.subscribe(() => {
	state.change((state) => ({ ...state, count: state.count + 1 }));
});

changeInput.subscribe((inputValue) => {
	state.change((state) => ({ ...state, input: inputValue }));
});

reset.subscribe(() => {
	state.reset();
});

export { increment, countState, reset, changeInput, inputState };
