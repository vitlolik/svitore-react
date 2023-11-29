import { Svitore } from "svitore";

const $module = Svitore.Module("svitore react module");

const increment = $module.Event();
const reset = $module.Event();

const countState = $module
	.State(3)
	.changeOn(increment, (_, state) => state + 1)
	.resetOn(reset);

export { increment, countState, reset };
