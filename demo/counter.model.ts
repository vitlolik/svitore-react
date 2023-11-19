import { Svitore } from "svitore";

const svitoreReactModule = Svitore.initModule("svitore react module");

const increment = svitoreReactModule.initEvent();
const reset = svitoreReactModule.initEvent();

const countState = svitoreReactModule
	.initState(0)
	.changeOn(increment, (_, state) => state + 1)
	.resetOn(reset);

export { increment, countState, reset };
