import { describe, expect, it, vi } from "vitest";
import { State } from "svitore";
import { useSyncExternalStore } from "react";
import { useState } from "./useState";

describe("useState", () => {
	it("should call useSyncExternalStore from react", () => {
		vi.mock("react", () => {
			return { useSyncExternalStore: vi.fn() };
		});

		const $test = new State("");
		useState($test);
		expect(useSyncExternalStore).toHaveBeenCalledTimes(1);
		vi.unmock("react");
	});
});
