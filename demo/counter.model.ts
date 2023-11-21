import { Svitore } from "svitore";

const svitoreReactModule = Svitore.createModule("svitore react module");

const increment = svitoreReactModule.createEvent();
const reset = svitoreReactModule.createEvent();

const countState = svitoreReactModule
	.createState(3)
	.changeOn(increment, (_, state) => state + 1)
	.resetOn(reset);

export { increment, countState, reset };
