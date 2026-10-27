/** На столько ниже шапки должен подняться заголовок раздела, чтобы окна пошли. */
const LINE = 40

/**
 * Хаос в плитку: пока раздел не доехал, окна лежат вразброс (`final--armed`). Когда его заголовок
 * поднялся к шапке, раздел получает `final--tiled`, и окна по очереди плавно расходятся по
 * плитке. Один раз: обратно в хаос они не возвращаются.
 */
export function initFinal(section: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const header = document.querySelector<HTMLElement>('[data-header]')

	section.classList.add('final--armed')

	function check() {
		if (section.getBoundingClientRect().top > (header?.offsetHeight ?? 0) + LINE) return

		section.classList.add('final--tiled')
		removeEventListener('scroll', check)
	}

	addEventListener('scroll', check, { passive: true })
	check()
}
