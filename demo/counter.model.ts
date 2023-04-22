import { State, Event } from "svitore";

const increment = new Event();
const reset = new Event();
const changeInput = new Event<string>();

const countState = new State(0);
const inputState = new State("");

increment.listen(() => {
	countState.change((state) => state + 1);
});

changeInput.listen((inputValue) => inputState.set(inputValue));

reset.listen(() => {
	countState.reset();
	inputState.reset();
});

export { increment, countState, reset, changeInput, inputState };
