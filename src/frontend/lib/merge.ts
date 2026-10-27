import { clamp, onScrollFrames, sectionProgress, spring } from '#frontend/lib/scrolly.ts'

/** Насколько позже соседки трогается каждая следующая плашка, в долях всего пути. */
const STAGGER = 0.08

/**
 * Плашки слетаются в иконку kumiko, но не прибиты к прокрутке: прокрутка задаёт цель, а плашки
 * догоняют её на пружине, с перелётом и сплющиваясь по скорости, поэтому движение мягкое, а не
 * рывками за колесом. Каждая следующая трогается чуть позже. Иконка вздрагивает от каждого глотка
 * и подрастает, а проглотив последнюю, становится заметно больше, и сцена получает `merge--full`.
 */
export function initMerge(stage: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const section = stage.closest<HTMLElement>('[data-merge-section]')!
	const tools = [...stage.querySelectorAll<HTMLElement>('[data-tool]')]
	const core = stage.querySelector<HTMLElement>('[data-core]')!
	const span = 1 - (tools.length - 1) * STAGGER
	const path = spring()
	const grow = spring(0.12, 0.72)

	grow.x = 0.85

	let swallowed = 0

	section.classList.add('merge--scrolly')

	onScrollFrames(() => {
		// В начале раздела плашки ещё постоят, к концу поглощение кончается с запасом, чтобы
		// полюбоваться на выросшую иконку
		const goal = clamp((sectionProgress(section) - 0.12) / 0.62)
		// Проглоченное назад не выпускаем: прокрутка вверх больше не разбирает выросшую иконку
		const still = path.step(swallowed === tools.length ? 1 : goal)
		const squash = clamp(path.v * 6, -0.25, 0.25).toFixed(3)

		let eaten = 0

		tools.forEach((tool, i) => {
			const k = clamp((path.x - i * STAGGER) / span)

			if (k >= 0.98) eaten++

			tool.style.setProperty('--k', k.toFixed(4))
			tool.style.setProperty('--squash', squash)
		})

		// Глоток: иконка дёргается вверх по размеру и отпружинивает обратно
		if (eaten > swallowed) grow.v += 0.05 * (eaten - swallowed)

		swallowed = eaten

		const full = eaten === tools.length
		const grown = grow.step(0.85 + 0.05 * eaten + (full ? 0.2 : 0))

		stage.classList.toggle('merge--full', full)
		core.style.setProperty('--grow', grow.x.toFixed(4))
		core.style.setProperty('--tilt', ((1 - clamp(path.x)) * -10).toFixed(2))

		return still && grown
	})
}
