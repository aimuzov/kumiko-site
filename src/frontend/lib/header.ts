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

/**
 * Текущий раздел главной: последний, чей верх уже поднялся выше трети экрана. Над первым экраном
 * раздела нет, и подложка гаснет. На других страницах она стоит на пункте с `aria-current="page"`.
 */
export function initSectionSpy(nav: HTMLElement) {
	const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[data-section]')]
	const sections = links.map((link) => document.getElementById(link.dataset.section!))
	const pill = nav.querySelector<HTMLElement>('.header__pill')!
	let frame = 0

	function show(link: HTMLAnchorElement | undefined) {
		nav.toggleAttribute('data-pill', !!link)

		if (!link) return

		pill.style.setProperty('--pill-x', `${link.offsetLeft}px`)
		pill.style.setProperty('--pill-w', `${link.offsetWidth}px`)
	}

	function sync() {
		frame = 0

		const line = innerHeight / 3
		let active: HTMLAnchorElement | undefined

		sections.forEach((section, i) => {
			if (section && section.getBoundingClientRect().top <= line) active = links[i]
		})

		for (const link of links) {
			if (link === active) link.setAttribute('aria-current', 'location')
			else link.removeAttribute('aria-current')
		}

		show(active ?? nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ?? undefined)
	}

	if (sections.some(Boolean))
		addEventListener('scroll', () => (frame ||= requestAnimationFrame(sync)), { passive: true })

	addEventListener('resize', sync)
	sync()
}
