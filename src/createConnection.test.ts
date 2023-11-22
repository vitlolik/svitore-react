import { describe, expect, test, vi } from "vitest";
import { Event, State } from "svitore";
import { renderHook } from "@testing-library/react";

import { createConnection } from "./createConnection";

describe("createConnection", () => {
	test("should return entities", () => {
		const { connection } = createConnection();

		expect(connection.state).instanceof(State);
		expect(connection.state.get()).toBeUndefined();
		expect(connection.mounted).instanceof(Event);
		expect(connection.unmounted).instanceof(Event);
	});

	test("should call mounted event when hook has been setup", () => {
		const { connection, useConnection } = createConnection<string>();
		const testSub = vi.fn();
		connection.mounted.subscribe((payload) => testSub(payload));

		renderHook(() => useConnection("test data"));
		expect(testSub).toHaveBeenCalledOnce();
		expect(testSub).toHaveBeenCalledWith("test data");
	});

	test("should change state, when param has been changed", () => {
		const { connection, useConnection } = createConnection<string>();
		const testSub = vi.fn();
		connection.state.subscribe((data) => testSub(data));

		const { rerender } = renderHook(({ value }) => useConnection(value), {
			initialProps: { value: "test data" },
		});
		expect(testSub).toHaveBeenCalledOnce();
		expect(testSub).toHaveBeenCalledWith("test data");

		rerender({ value: "new test data" });
		expect(testSub).toBeCalledTimes(2);
		expect(testSub).toHaveBeenCalledWith("new test data");
	});

	test("should call unmounted event when component has been unmounted", () => {
		const { connection, useConnection } = createConnection<string>();
		const testSub = vi.fn();
		connection.unmounted.subscribe((data) => testSub(data));

		renderHook(() => useConnection("test data")).unmount();

		expect(testSub).toHaveBeenCalledOnce();
		expect(testSub).toHaveBeenCalledWith("test data");
	});

	test("should clean entities", () => {
		const { connection, useConnection, release } = createConnection<string>();

		const { rerender } = renderHook(({ value }) => useConnection(value), {
			initialProps: { value: "test data" },
		});
		const testSub = vi.fn();

		connection.mounted.subscribe((data) => testSub(data));
		connection.state.subscribe((data) => testSub(data));
		connection.unmounted.subscribe((data) => testSub(data));
		release();

		rerender({ value: "new test data" });
		rerender({ value: "one more new test data" });

		expect(testSub).not.toHaveBeenCalled();
	});
});
