export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/**
 * Доля пройденного высокого раздела с липкой сценой: 0, когда его верх у верха экрана, 1, когда
 * низ у низа. Заодно кладёт её в `--p` раздела для параллакса в CSS.
 */
export function sectionProgress(section: HTMLElement) {
	const box = section.getBoundingClientRect()
	const p = clamp(-box.top / (box.height - innerHeight))

	section.style.setProperty('--p', p.toFixed(3))

	return p
}

/** Пружина, которая догоняет цель с небольшим перелётом. Сцены зовут `step` раз в кадр. */
export function spring(stiffness = 0.06, damping = 0.82) {
	const state = { x: 0, v: 0 }

	return Object.assign(state, {
		step(goal: number) {
			state.v = (state.v + (goal - state.x) * stiffness) * damping
			state.x += state.v

			return Math.abs(goal - state.x) < 0.0005 && Math.abs(state.v) < 0.0005
		},
	})
}

/** Кадры сцены идут, пока она не успокоится, и снова просыпаются от прокрутки. */
export function onScrollFrames(tick: () => boolean) {
	let frame = 0

	const run = () => {
		frame = tick() ? 0 : requestAnimationFrame(run)
	}
	const wake = () => (frame ||= requestAnimationFrame(run))

	addEventListener('scroll', wake, { passive: true })
	addEventListener('resize', wake)
	run()
}
