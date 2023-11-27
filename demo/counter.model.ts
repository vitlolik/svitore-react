import { Svitore } from "svitore";

const $module = Svitore.createModule("svitore react module");

const increment = $module.createEvent();
const reset = $module.createEvent();

const countState = $module
	.createState(3)
	.changeOn(increment, (_, state) => state + 1)
	.resetOn(reset);

export { increment, countState, reset };
