/**
 * Шапка узнаёт о двух вещах: страница под ней сдвинулась (`data-scrolled`, шапка становится
 * стеклом) и большая кнопка скачивания первого экрана ушла за край (`data-cta-gone`, своя
 * маленькая выезжает). На страницах без большой кнопки маленькая видна сразу.
 */
export function initHeader(header: HTMLElement) {
	const sync = () => header.toggleAttribute('data-scrolled', scrollY > 8)

	addEventListener('scroll', sync, { passive: true })
	sync()

	const cta = document.querySelector('[data-cta]')

	if (!cta) {
		header.toggleAttribute('data-cta-gone', true)

		return
	}

	new IntersectionObserver(([entry]) => header.toggleAttribute('data-cta-gone', !entry.isIntersecting), {
		rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
	}).observe(cta)
}
