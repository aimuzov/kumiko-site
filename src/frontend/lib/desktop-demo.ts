import { bsp, neighbour, type Direction } from '#frontend/lib/tiling.ts'

const KINDS = ['code', 'web', 'chat', 'term', 'notes', 'music'] as const

type Kind = (typeof KINDS)[number]
type Win = { kind: Kind; el: HTMLElement }

/** С чем открываются столы: первый уже нарисован разметкой, остальные скрипт создаёт сам. */
const START: Kind[][] = [['code', 'web', 'chat'], ['term', 'notes'], ['music'], []]

const DIRECTIONS: Record<string, Direction> = { h: 'west', j: 'south', k: 'north', l: 'east' }

/** Что демо показывает само, пока гость не взялся за клавиши: по шагу раз в STEP. */
const SHOW = ['n', 'h', 'l', 'x', '2', 'n', 'k', 'x', '3', '1', 'j', 'x', 'n']
const STEP = 1400

/** Через столько тишины после гостя демо снова показывает себя само. */
const IDLE = 10_000

/** Сколько гаснет закрытое окно, прежде чем уйти из разметки. */
const CLOSING = 300

/** Узел с классами, для окна и точки на баре. */
function node(className: string, ...children: Node[]) {
	const el = document.createElement(children.length ? 'div' : 'span')

	el.className = className
	el.append(...children)

	return el
}

/**
 * Демо рабочего стола слушается, как сам kumiko: h j k l двигают фокус к соседнему окну, n
 * открывает окно, x закрывает окно в фокусе, кроме последнего на столе, 1-4 и клик по бару
 * переключают столы, клик по окну ставит на него фокус. Раскладка -- BSP из lib/tiling.ts.
 * Клавиши ловятся, только пока демо на экране и курсор не в поле ввода.
 */
export function initDesktopDemo(demo: HTMLElement) {
	const area = demo.querySelector<HTMLElement>('[data-area]')!
	const pills = [...demo.querySelectorAll<HTMLElement>('[data-space]')]
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

	const spaces: Win[][] = START.map((kinds, s) =>
		kinds.map((kind) => ({
			kind,
			el: (s === 0 && area.querySelector<HTMLElement>(`[data-win="${kind}"]`)) || create(kind),
		})),
	)
	const focus = spaces.map(() => 0)

	let current = 0
	let visible = false
	let show = 0
	let busy: ReturnType<typeof setTimeout> | undefined

	function create(kind: Kind) {
		const el = node(
			'desktop__slot',
			node(`desktop__win desktop__win--${kind}`, node('desktop__chrome'), node('desktop__body')),
		)

		el.dataset.win = kind
		area.append(el)

		return el
	}

	function render() {
		spaces.forEach((wins, s) => {
			const rects = bsp(wins.length)

			wins.forEach(({ el }, i) => {
				const r = rects[i]

				el.classList.remove('desktop__slot--0', 'desktop__slot--1', 'desktop__slot--2')
				Object.assign(el.style, { left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` })
				el.classList.toggle('is-away', s !== current)
				el.classList.toggle('is-focus', s === current && i === focus[s])
			})
		})

		pills.forEach((pill, s) => {
			pill.classList.toggle('is-current', s === current)

			pill.querySelector('[data-dots]')!.replaceChildren(
				...spaces[s].map(({ kind }) => node(`desktop__dot desktop__dot--${kind}`)),
			)
		})
	}

	function open() {
		const wins = spaces[current]
		const kind = KINDS.find((k) => !wins.some((w) => w.kind === k)) ?? KINDS[wins.length % KINDS.length]
		const at = Math.min(focus[current] + 1, wins.length)
		const el = create(kind)

		el.classList.add('is-new')
		wins.splice(at, 0, { kind, el })
		focus[current] = at
		render()
		// Кадр на то, чтобы окно встало на место сжатым, и только потом оно разворачивается
		requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-new')))
	}

	function close() {
		const wins = spaces[current]

		if (wins.length <= 1) return

		const [{ el }] = wins.splice(focus[current], 1)

		el.classList.add('is-closing')
		setTimeout(() => el.remove(), reduced ? 0 : CLOSING)
		focus[current] = Math.min(focus[current], wins.length - 1)
		render()
	}

	// Стол сменяется мгновенно, как у kumiko: на кадр отключаем переходы, чтобы окна не ехали
	function switchTo(space: number) {
		current = space
		demo.dataset.switching = ''
		requestAnimationFrame(() => requestAnimationFrame(() => delete demo.dataset.switching))
	}

	function press(key: string) {
		if (key in DIRECTIONS) {
			const next = neighbour(bsp(spaces[current].length), focus[current], DIRECTIONS[key])

			if (next >= 0) focus[current] = next
		} else if (key === 'n') open()
		else if (key === 'x') close()
		else if (key >= '1' && key <= String(spaces.length)) switchTo(Number(key) - 1)
		else return false

		render()

		return true
	}

	// Гость взялся сам -- показ встаёт и вернётся после тишины
	function pause() {
		clearTimeout(busy)
		busy = setTimeout(() => (busy = undefined), IDLE)
	}

	new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 }).observe(demo)

	addEventListener('keydown', (event) => {
		const target = event.target as HTMLElement

		if (!visible || event.metaKey || event.ctrlKey || event.altKey || target.closest('input, textarea, select'))
			return

		if (event.key.length === 1 && press(event.key)) {
			event.preventDefault()
			pause()
		}
	})

	demo.addEventListener('click', (event) => {
		const target = event.target as HTMLElement
		const pill = target.closest<HTMLElement>('[data-space]')
		const slot = target.closest<HTMLElement>('[data-win]')

		if (pill) switchTo(Number(pill.dataset.space))
		else if (slot) focus[current] = spaces[current].findIndex((w) => w.el === slot)
		else return

		render()
		pause()
	})

	if (!reduced)
		setInterval(() => {
			if (!visible || busy) return

			press(SHOW[show])
			show = (show + 1) % SHOW.length
		}, STEP)

	const clock = demo.querySelector<HTMLElement>('[data-clock]')
	const tick = () => {
		if (clock)
			clock.textContent = new Date().toLocaleTimeString(document.documentElement.lang, {
				hour: '2-digit',
				minute: '2-digit',
			})
	}

	tick()
	setInterval(tick, 30_000)
	render()
}
