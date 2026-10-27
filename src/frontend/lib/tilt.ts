/** Сильнее наклона карточка выглядит уже не живой, а падающей. */
const MAX = 6

/**
 * Карточка поворачивается к курсору, а пятно света под ним идёт следом. Только для мыши
 * и только если система не просит меньше движения: на тач-экране наклонять нечем.
 */
export function initTilt(card: HTMLElement) {
	if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return

	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

	card.addEventListener('pointermove', (event) => {
		const box = card.getBoundingClientRect()
		const x = (event.clientX - box.left) / box.width
		const y = (event.clientY - box.top) / box.height

		card.style.setProperty('--tilt-x', `${((0.5 - y) * MAX * 2).toFixed(2)}deg`)
		card.style.setProperty('--tilt-y', `${((x - 0.5) * MAX * 2).toFixed(2)}deg`)
		card.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`)
		card.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`)
	})

	card.addEventListener('pointerleave', () => {
		card.style.removeProperty('--tilt-x')
		card.style.removeProperty('--tilt-y')
	})
}
