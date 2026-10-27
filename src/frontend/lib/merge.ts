/** Насколько позже соседки трогается каждая следующая плашка, в долях всего пути. */
const STAGGER = 0.08

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

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

	let x = 0
	let v = 0
	let grow = 0.85
	let growV = 0
	let swallowed = 0
	let frame = 0

	section.classList.add('merge--scrolly')

	// Доля пройденного высокого раздела. В начале плашки ещё постоят, к концу поглощение кончается
	// с запасом, чтобы полюбоваться на выросшую иконку
	function target() {
		const box = section.getBoundingClientRect()
		const p = clamp(-box.top / (box.height - innerHeight))

		section.style.setProperty('--p', p.toFixed(3))

		return clamp((p - 0.12) / 0.62)
	}

	function tick() {
		const goal = target()

		v = (v + (goal - x) * 0.06) * 0.82
		x += v

		let eaten = 0
		const squash = clamp(v * 6, -0.25, 0.25).toFixed(3)

		tools.forEach((tool, i) => {
			const k = clamp((x - i * STAGGER) / span)

			if (k >= 0.98) eaten++

			tool.style.setProperty('--k', k.toFixed(4))
			tool.style.setProperty('--squash', squash)
		})

		// Глоток: иконка дёргается вверх по размеру и отпружинивает обратно
		if (eaten > swallowed) growV += 0.05 * (eaten - swallowed)

		swallowed = eaten

		const full = eaten === tools.length
		const size = 0.85 + 0.05 * eaten + (full ? 0.2 : 0)

		stage.classList.toggle('merge--full', full)
		growV = (growV + (size - grow) * 0.12) * 0.72
		grow += growV
		core.style.setProperty('--grow', grow.toFixed(4))
		core.style.setProperty('--tilt', ((1 - clamp(x)) * -10).toFixed(2))

		const settled = [goal - x, v, size - grow, growV].every((d) => Math.abs(d) < 0.0005)

		frame = settled ? 0 : requestAnimationFrame(tick)
	}

	const wake = () => (frame ||= requestAnimationFrame(tick))

	addEventListener('scroll', wake, { passive: true })
	addEventListener('resize', wake)
	tick()
}
