import {
	NumberFlowLite,
	canAnimate as _canAnimate,
	prefersReducedMotion as _prefersReducedMotion,
	define
} from 'number-flow'
import { onMount } from 'svelte'
import { derived, readable } from 'svelte/store'
export type { Value, Format, Trend, NumberFlowLite } from 'number-flow'

define('number-flow-lite', NumberFlowLite)

export { default } from './NumberFlow.svelte'

const canAnimate = readable(_canAnimate, (set) => {
	onMount(() => {
		set(_canAnimate)
	})
})

const prefersReducedMotion = readable(false, (set) => {
	onMount(() => {
		set(_prefersReducedMotion?.matches ?? false)
		const onChange = ({ matches }: MediaQueryListEvent) => {
			set(matches)
		}
		_prefersReducedMotion?.addEventListener('change', onChange)
		return () => {
			_prefersReducedMotion?.removeEventListener('change', onChange)
		}
	})
})

const canAnimateWithPreference = derived(
	[canAnimate, prefersReducedMotion],
	([canAnimate, prefersReducedMotion]) => canAnimate && !prefersReducedMotion
)

export const getCanAnimate = ({ respectMotionPreference = true } = {}) =>
	respectMotionPreference ? canAnimateWithPreference : canAnimate
