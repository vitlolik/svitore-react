import { State, Event } from "svitore";

const increment = new Event();
const reset = new Event();
const countState = new State(0);

increment.listen(() => {
	countState.change((state) => state + 1);
});

reset.listen(() => countState.reset());

export { increment, countState, reset };
