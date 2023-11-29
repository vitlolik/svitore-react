import React from 'react';
import { renderHook } from '@testing-library/react';
import { Event } from 'svitore';
import { describe, expect, test, vi } from 'vitest';

import { useEvent } from './useEvent';
import { SvitoreContext, SvitoreContextValue } from './Context';

describe('useEvent', () => {
	test("should return dispatch function", () => {
		const event = new Event<number>();
		const mockSubscriber = vi.fn();
		event.subscribe(mockSubscriber)
		const { result } = renderHook(() => useEvent(event));

		result.current(10);

		expect(mockSubscriber).toHaveBeenCalledOnce()
		expect(mockSubscriber).toHaveBeenCalledWith(10)
	});

	test("should override from context", () => {
		const mockSubscriber = vi.fn();
		const mockOverrideSubscriber = vi.fn();

		const event = new Event<number>();
		event.subscribe(mockSubscriber)

		const overrideEvent = new Event<number>();
		overrideEvent.subscribe(mockOverrideSubscriber)

		const { result } = renderHook(() => useEvent(event), {
			wrapper: ({ children }) => {
				const value: SvitoreContextValue = new Map([[event, overrideEvent]]);

				return (
					<SvitoreContext.Provider value={value}>
						{children}
					</SvitoreContext.Provider>
				)
			}
		});

		result.current(15);

		expect(mockSubscriber).not.toHaveBeenCalled();
		expect(mockOverrideSubscriber).toHaveBeenCalledOnce();
		expect(mockOverrideSubscriber).toHaveBeenCalledWith(15)
	});
})
