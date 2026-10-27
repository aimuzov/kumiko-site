type Win = 'code' | 'web' | 'chat' | 'term'

/** Куда уходит фокус по h, j, k, l из каждого окна. Терминал -- справа от чата, когда открыт. */
const NEIGHBOURS: Record<Win, Partial<Record<string, Win>>> = {
	code: { l: 'web' },
	web: { h: 'code', j: 'chat' },
	chat: { h: 'code', k: 'web', l: 'term' },
	term: { h: 'chat', k: 'web' },
}

/** Через столько тишины демо возвращается к своему циклу. */
const IDLE = 12_000

/**
 * Демо рабочего стола слушается, как сам kumiko: h j k l двигают фокус, n открывает терминал,
 * x закрывает, клик по окну ставит на него фокус. Клавиши ловятся, только пока демо на экране и
 * курсор не в поле ввода, так что остальной странице они не мешают.
 */
export function initDesktopDemo(demo: HTMLElement) {
	let visible = false
	let idle: ReturnType<typeof setTimeout> | undefined

	new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 }).observe(demo)

	function focus(win: Win) {
		demo.dataset.live = ''
		demo.dataset.focus = win
		clearTimeout(idle)

		idle = setTimeout(() => {
			delete demo.dataset.live
			delete demo.dataset.focus
			delete demo.dataset.term
		}, IDLE)
	}

	function current(): Win {
		return (demo.dataset.focus as Win | undefined) ?? 'code'
	}

	function press(key: string) {
		const term = 'term' in demo.dataset

		if (key === 'n') {
			demo.dataset.term = ''
			focus('term')
		} else if (key === 'x' && term) {
			delete demo.dataset.term
			focus(current() === 'term' ? 'chat' : current())
		} else if ('hjkl'.includes(key)) {
			const next = NEIGHBOURS[current()][key]

			// Соседа нет -- фокус остаётся, но цикл всё равно встаёт: гость видит, что его слышат
			focus(next && (next !== 'term' || term) ? next : current())
		} else {
			return false
		}

		return true
	}

	addEventListener('keydown', (event) => {
		const target = event.target as HTMLElement

		if (!visible || event.metaKey || event.ctrlKey || event.altKey || target.closest('input, textarea, select'))
			return

		if (event.key.length === 1 && press(event.key)) event.preventDefault()
	})

	demo.addEventListener('click', (event) => {
		const win = (event.target as HTMLElement).closest<HTMLElement>('[data-win]')?.dataset.win as Win | undefined

		if (win) focus(win)
	})
}
