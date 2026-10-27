/** Прямоугольник в процентах области окон. */
export type Rect = { x: number; y: number; w: number; h: number }

const FULL: Rect = { x: 0, y: 0, w: 100, h: 100 }

// Проценты уходят в стили, хвосты вроде 55.00000000000001 там ни к чему
const round = (r: Rect): Rect => ({
	x: +r.x.toFixed(3),
	y: +r.y.toFixed(3),
	w: +r.w.toFixed(3),
	h: +r.h.toFixed(3),
})

/**
 * Плитка, как BSP у kumiko: первое окно берёт половину области, остальные делят вторую так же,
 * и сторона деления чередуется -- сначала слева направо, потом сверху вниз. `ratio` -- доля
 * первого окна в первом делении, у остальных пополам.
 */
export function bsp(count: number, ratio = 0.55, area: Rect = FULL, vertical = true): Rect[] {
	if (count <= 0) return []

	if (count === 1) return [round(area)]

	const [first, rest]: [Rect, Rect] = vertical
		? [
				{ ...area, w: area.w * ratio },
				{ ...area, x: area.x + area.w * ratio, w: area.w * (1 - ratio) },
			]
		: [
				{ ...area, h: area.h * ratio },
				{ ...area, y: area.y + area.h * ratio, h: area.h * (1 - ratio) },
			]

	return [round(first), ...bsp(count - 1, 0.5, rest, !vertical)]
}

/** Сторона, куда ведут h, j, k, l. */
export type Direction = 'west' | 'south' | 'north' | 'east'

/**
 * Сосед в сторону, как `window focus west` у kumiko: из окон, что целиком лежат по ту сторону
 * от текущего, ближайшее, а при равенстве -- то, что меньше уходит вбок.
 */
export function neighbour(rects: Rect[], from: number, direction: Direction) {
	const a = rects[from]

	if (!a) return -1

	const center = (r: Rect) => [r.x + r.w / 2, r.y + r.h / 2]
	const [ax, ay] = center(a)
	let best = -1
	let bestScore = Infinity

	rects.forEach((b, i) => {
		if (i === from) return

		const ahead = {
			west: b.x + b.w <= a.x + 0.01,
			east: b.x >= a.x + a.w - 0.01,
			north: b.y + b.h <= a.y + 0.01,
			south: b.y >= a.y + a.h - 0.01,
		}[direction]

		if (!ahead) return

		const [bx, by] = center(b)
		const along = direction === 'west' || direction === 'east' ? Math.abs(bx - ax) : Math.abs(by - ay)
		const aside = direction === 'west' || direction === 'east' ? Math.abs(by - ay) : Math.abs(bx - ax)
		const score = along + aside * 2

		if (score < bestScore) {
			best = i
			bestScore = score
		}
	})

	return best
}
