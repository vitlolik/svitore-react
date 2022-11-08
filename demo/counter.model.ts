import { State, Event } from "svitore";

const increment = new Event();
const reset = new Event();
const $count = new State(0)
	.on(increment, (_payload, state) => state + 1)
	.onReset(reset);

export { increment, $count, reset };
