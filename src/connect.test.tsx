import React from "react";
import { describe, expect, test, vi } from "vitest";
import { act, render, fireEvent } from "@testing-library/react";
import { State, Event } from "svitore";
import "@testing-library/jest-dom/matchers";

import { connect } from "./connect";

describe("connect", () => {
	test("should return react component", () => {
		const state1 = new State("test value");
		const state2 = new State(10);
		const TestComponent = vi.fn(() => null);
		const Connected = connect(TestComponent, { value1: state1, value2: state2 });

		render(<Connected />);
		expect(TestComponent).toHaveBeenCalledWith(
			{ value1: "test value", value2: 10 },
			{}
		);
	});

	test("should call mount callback", () => {
		const state = new State("test value");
		const onMountMock = vi.fn();
		const Connected = connect(() => null, { value: state }, { onMount: onMountMock })

		render(<Connected />);

		expect(onMountMock).toHaveBeenCalledTimes(1);
		expect(onMountMock).toHaveBeenCalledWith({ value: "test value" });
	});

	test("should call unmount callback", () => {
		const state = new State("some test value");
		const onUnMountMock = vi.fn();
		const Connected = connect(() => null, { value: state }, { onUnMount: onUnMountMock });

		const { unmount } = render(<Connected />);
		unmount();

		expect(onUnMountMock).toHaveBeenCalledTimes(1);
		expect(onUnMountMock).toHaveBeenCalledWith({ value: "some test value" });
	});

	test("should not call the update callback when mount", () => {
		const state = new State("new test value");
		const onUpdateMock = vi.fn();
		const Connected = connect(() => null, { value: state }, { onUpdate: onUpdateMock });

		render(<Connected />);

		expect(onUpdateMock).toHaveBeenCalledTimes(0);
	});

	test("should call the update callback when props changed", () => {
		const onUpdateMock = vi.fn();

		const Connected = connect(
			() => null,
			{ value: new State("test value") },
			{ onUpdate: onUpdateMock }
		);

		const { rerender } = render(<Connected />);

		rerender(<Connected value="new test value" />);

		expect(onUpdateMock).toHaveBeenCalledTimes(1);
		expect(onUpdateMock).toHaveBeenCalledWith({ value: "new test value" }, { value: 'test value' });
	});

	test("should rerender when state changed", () => {
		const test = new State("test value");
		const TestComponent = vi.fn(() => null);

		const Connected = connect(
			TestComponent,
			{ value: test }
		);

		render(<Connected />);
		expect(TestComponent).toHaveBeenCalledTimes(1);

		act(() => {
			test.set('new test value');
		});

		expect(TestComponent).toHaveBeenCalledTimes(2);

		act(() => {
			test.set('one more new test value');
		});

		expect(TestComponent).toHaveBeenCalledTimes(3);
	});

	test("should bind events", () => {
		const event = new Event();
		event.dispatch = vi.fn();
		const eventWithPayload = new Event<string>();
		eventWithPayload.dispatch = vi.fn();

		const TestComponent = vi.fn<[{ event: () => void; eventWithPayload: (value: string) => void }]>(({ event, eventWithPayload }) => (
			<button onClick={() => {
				event();
				eventWithPayload('test value');
			}}>Click</button>));

		const Connected = connect(
			TestComponent,
			{ event, eventWithPayload }
		);

		const { getByRole } = render(<Connected />);
		fireEvent.click(getByRole('button'));


		expect(event.dispatch).toHaveBeenCalledTimes(1);
		expect(eventWithPayload.dispatch).toHaveBeenCalledTimes(1);
		expect(eventWithPayload.dispatch).toHaveBeenCalledWith('test value')
	});

	test("should unsubscribe from state if some props replace this state", () => {
		const test = new State("test value");
		const TestComponent = vi.fn();

		const Connected = connect(
			TestComponent,
			{ value: test }
		);

		const { rerender } = render(<Connected />);
		expect(TestComponent).toHaveBeenCalledTimes(1);
		expect(TestComponent).toHaveBeenCalledWith({ value: 'test value' }, {});

		rerender(<Connected value="value from props" />);
		expect(TestComponent).toHaveBeenCalledTimes(2);
		expect(TestComponent).toHaveBeenCalledWith({ value: 'value from props' }, {});

		act(() => {
			test.set('new test value');
		});
		expect(TestComponent).toHaveBeenCalledTimes(2);
	});

	test("should set name for component", () => {
		const test = new State("test value");
		const TestComponent = (): any => null;

		const Connected = connect(
			TestComponent,
			{ value: test }
		);

		expect(Connected.displayName).toBe('svitore(TestComponent)');
	});
});
