import React from 'react';
import { describe, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Event, State } from "svitore";

import { useState } from "./useState";
import { SvitoreContext, SvitoreContextValue } from './Context';

describe("useState", () => {
	test("should return value from state", () => {
		const state = new State("test value");
		const { result } = renderHook(() => useState(state));

		expect(result.current).toBe("test value");
	});

	test("should update component", () => {
		const changeEvent = new Event<string>();
		const state = new State("test value").changeOn(changeEvent);
		const { result } = renderHook(() => useState(state));

		act(() => {
			changeEvent.dispatch("new test value");
		});
		expect(result.current).toBe("new test value");

		act(() => {
			changeEvent.dispatch("another new test value");
		});
		expect(result.current).toBe("another new test value");
	});

	test("should call selector function", () => {
		const state = new State("test value");
		const { result } = renderHook(() =>
			useState(state, (value) => value.toUpperCase())
		);

		expect(result.current).toBe("TEST VALUE");
	});

	test("should override from context", () => {
		const state = new State("test value");
		const { result } = renderHook(() => useState(state), {
			wrapper: ({ children }) => {
				const value: SvitoreContextValue = new Map([[state, new State('overridden')]]);

				return (
					<SvitoreContext.Provider value={value}>
						{children}
					</SvitoreContext.Provider>
				)
			}
		});

		expect(result.current).toBe("overridden");
	});
});
