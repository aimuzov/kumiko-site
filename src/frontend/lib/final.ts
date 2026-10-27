import { clamp, onScrollFrames, sectionProgress, spring } from '#frontend/lib/scrolly.ts'

/** Насколько позже соседнего встаёт каждое следующее окно, в долях всего пути. */
const STAGGER = 0.07

/**
 * Хаос в плитку: прокрутка высокого раздела задаёт цель, окна догоняют её на пружине и встают на
 * места по одному, окно со скачиванием -- последним. Когда встали все, раздел получает
 * `data-done`, и на этом окне загорается рамка фокуса.
 */
export function initFinal(section: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const slots = [...section.querySelectorAll<HTMLElement>('[data-slot]')]
	const span = 1 - (slots.length - 1) * STAGGER
	const path = spring(0.05, 0.84)

	section.classList.add('final--scrolly')

	onScrollFrames(() => {
		// Сначала хаос постоит, раскладка кончается с запасом, чтобы осталось время на кнопку
		const still = path.step(clamp((sectionProgress(section) - 0.15) / 0.6))

		let placed = 0

		slots.forEach((slot, i) => {
			const k = clamp((path.x - i * STAGGER) / span)

			if (k >= 0.98) placed++

			slot.style.setProperty('--k', k.toFixed(4))
		})

		section.toggleAttribute('data-done', placed === slots.length)

		return still
	})
}
