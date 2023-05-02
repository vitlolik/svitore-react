import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Event } from "svitore";

import { useListener } from "./useListener";

describe("useListener", () => {
	test("should return void", () => {
		const event = new Event();
		const subscriber = vi.fn();
		const { result } = renderHook(() => useListener(event, subscriber));

		expect(result.current).toBeUndefined();
	});

	test("should call hook when event have been dispatched", () => {
		const event = new Event<string>();
		const subscriber = vi.fn();
		renderHook(() => useListener(event, subscriber));

		act(() => {
			event.dispatch("test");
		});
		expect(subscriber).toHaveBeenCalledTimes(1);
		expect(subscriber).toHaveBeenCalledWith("test");

		act(() => {
			event.dispatch("new test");
		});
		expect(subscriber).toHaveBeenCalledTimes(2);
		expect(subscriber).toHaveBeenCalledWith("new test");
	});
});
