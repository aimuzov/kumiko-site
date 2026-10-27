import { clamp, onScrollFrames } from '#frontend/lib/scrolly.ts'

/**
 * На какой доле пути заголовка через экран (`cover` у view()) он начинает рассыпаться и на какой
 * пыль уже улетела. Начало -- там, где `fade` в big-title.astro догасил цвет.
 */
const FROM = 0.62
const TO = 0.9

/** Сколько пылинка летит, в долях всего рассыпания. Задержка плюс полёт не выходят за 1. */
const LIFE = 0.25

/** Запас холста вокруг букв под разлёт, в долях размера шрифта: ветер дует вправо и вверх. */
const ROOM = { top: 1.6, right: 2.6, bottom: 0.5, left: 0.5 }

/** Пылинка: квадрат букв в точке `x`, `y` и куда его унесёт ветер. Всё в пикселях холста. */
export type Speck = {
	x: number
	y: number
	delay: number
	life: number
	dx: number
	dy: number
	sway: number
	phase: number
}

/** Насколько заголовок рассыпался: 0 -- ещё цел, 1 -- пыль улетела. */
export function snapProgress(top: number, height: number, viewport: number) {
	const cover = (viewport - top) / (viewport + height)

	return clamp((cover - FROM) / (TO - FROM))
}

/** Случайность с зерном: при прокрутке назад пыль собирается в те же буквы тем же путём. */
export function random(seed: number) {
	let state = seed >>> 0

	return () => {
		state = (state + 0x6d2b79f5) >>> 0

		let t = state

		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

		return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
	}
}

/**
 * Пылинки из квадратов букв. Левые трогаются раньше правых, поэтому заголовок осыпается волной,
 * а не весь разом. `width` -- ширина букв, `size` -- размер шрифта.
 */
export function specks(cells: { x: number; y: number }[], width: number, size: number): Speck[] {
	const next = random(cells.length)

	return cells.map(({ x, y }) => ({
		x,
		y,
		delay: (x / width) * 0.5 + next() * 0.15,
		life: LIFE + next() * 0.1,
		dx: size * (0.8 + next() * 1.4),
		dy: -size * (0.3 + next()),
		sway: size * 0.12 * next(),
		phase: next() * Math.PI * 2,
	}))
}

/**
 * Где пылинка на рассыпании `p`: сперва на месте, потом разгоняется по ветру, вьётся, мельчает
 * и тает.
 */
export function speckAt(speck: Speck, p: number) {
	const t = clamp((p - speck.delay) / speck.life)
	const drift = t * t
	const curl = speck.phase + t * 5

	return {
		x: speck.x + speck.dx * drift + Math.sin(curl) * speck.sway * t,
		y: speck.y + speck.dy * drift + Math.cos(curl) * speck.sway * t,
		alpha: 1 - t,
		scale: 1 - 0.6 * t,
	}
}

/**
 * В конце ухода огромный заголовок рассыпается пылью, как от щелчка Таноса. Буквы
 * перерисовываются на холст в том же слое, режутся на квадраты, и ветер уносит их вправо-вверх.
 * Пыль прибита к прокрутке: назад -- заголовок собирается. Без поддержки view() и для тех, кто
 * просит меньше движения, остаётся обычное угасание из CSS.
 */
export function initDust(title: HTMLElement) {
	const still = matchMedia('(prefers-reduced-motion: reduce)')

	if (still.matches) return

	if (!CSS.supports('animation-timeline: view()')) return

	const text = title.querySelector<HTMLElement>('.big-title__text')!
	const float = title.querySelector<HTMLElement>('.big-title__float')!
	const canvas = title.querySelector<HTMLCanvasElement>('.big-title__dust')!
	const ctx = canvas.getContext('2d')!
	const source = document.createElement('canvas')
	const word = float.textContent!

	let parts: Speck[] = []
	let color = ''
	let step = 1
	let left = 0
	let top = 0
	let dirty = true
	let drawn = false

	// Буквы рисуются на холст тем же шрифтом с той же раскладкой, что в CSS, иначе на подмене
	// заголовок дёрнется. Каждый символ ставится отдельно: так работает межбуквенный интервал и
	// там, где у холста нет `letterSpacing`, а кернинг берётся из ширины строки до символа
	function build() {
		const style = getComputedStyle(text)
		const size = parseFloat(style.fontSize)
		const width = float.offsetWidth
		const height = float.offsetHeight
		const ratio = Math.min(devicePixelRatio, 2)
		const room = {
			top: Math.round(size * ROOM.top),
			right: Math.round(size * ROOM.right),
			bottom: Math.round(size * ROOM.bottom),
			left: Math.round(size * ROOM.left),
		}

		Object.assign(canvas.style, {
			top: `${-room.top}px`,
			left: `${-room.left}px`,
			width: `${width + room.left + room.right}px`,
			height: `${height + room.top + room.bottom}px`,
		})

		canvas.width = Math.ceil((width + room.left + room.right) * ratio)
		canvas.height = Math.ceil((height + room.top + room.bottom) * ratio)
		source.width = Math.ceil(width * ratio)
		source.height = Math.ceil(height * ratio)

		const paint = source.getContext('2d', { willReadFrequently: true })!

		paint.scale(ratio, ratio)
		paint.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
		paint.fillStyle = color = style.color

		const metrics = paint.measureText(word)
		const ascent = metrics.fontBoundingBoxAscent
		const baseline = (height - ascent - metrics.fontBoundingBoxDescent) / 2 + ascent
		const spacing = parseFloat(style.letterSpacing) || 0
		const chars = [...word]

		chars.forEach((char, i) => {
			const x = paint.measureText(chars.slice(0, i + 1).join('')).width - paint.measureText(char).width

			paint.fillText(char, x + i * spacing, baseline)
		})

		// Квадрат в 1/32 кегля: на большом экране около 3px, мельче пыль уже не видна как пыль
		step = Math.max(2, Math.round((size / 32) * ratio))
		left = room.left * ratio
		top = room.top * ratio

		const { data } = paint.getImageData(0, 0, source.width, source.height)
		const cells: { x: number; y: number }[] = []

		for (let y = 0; y < source.height; y += step)
			for (let x = 0; x < source.width; x += step)
				if (inked(data, source.width, source.height, x, y, step)) cells.push({ x, y })

		parts = specks(cells, source.width, size * ratio)
		dirty = false
	}

	function draw(p: number) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		for (const speck of parts) {
			const at = speckAt(speck, p)

			if (at.alpha <= 0) continue

			const side = step * at.scale
			const inset = (step - side) / 2

			ctx.globalAlpha = at.alpha
			ctx.drawImage(source, speck.x, speck.y, step, step, left + at.x + inset, top + at.y + inset, side, side)
		}

		ctx.globalAlpha = 1
	}

	function frame() {
		const box = title.getBoundingClientRect()
		// Меньше движения попросили уже на открытой странице -- заголовок снова цел и стоит
		const p = still.matches ? 0 : snapProgress(box.top, box.height, innerHeight)

		// Начав рассыпаться, буквы уступают место холсту и после него не возвращаются: слой с
		// пылью больше не гаснет сам, иначе пыль погасла бы раньше, чем разлетелась
		title.classList.toggle('big-title--dusting', p > 0)

		if (p > 0 && p < 1) {
			// Цвет берётся живой: тема могла смениться, пока заголовок на экране
			if (dirty || getComputedStyle(text).color !== color) build()

			draw(p)
			drawn = true
		} else if (drawn) {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			drawn = false
		}

		return true
	}

	title.classList.add('big-title--dust')

	// Шрифт догрузился или экран сменил ширину -- буквы встали иначе, холст пересобирается
	const rebuild = () => {
		dirty = true
		frame()
	}

	new ResizeObserver(rebuild).observe(float)
	document.fonts.ready.then(rebuild)
	still.addEventListener('change', frame)
	onScrollFrames(frame)
}

/** Есть ли в квадрате хоть капля букв. */
function inked(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, step: number) {
	for (let j = y; j < Math.min(y + step, height); j++)
		for (let i = x; i < Math.min(x + step, width); i++) if (data[(j * width + i) * 4 + 3] > 0) return true

	return false
}
