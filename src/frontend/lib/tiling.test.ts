import assert from 'node:assert/strict'
import { test } from 'node:test'

import { bsp, neighbour } from './tiling.ts'

test('one window takes the whole area', () => {
	assert.deepEqual(bsp(1), [{ x: 0, y: 0, w: 100, h: 100 }])
})

test('the first window takes the left part, the rest split the right one top to bottom', () => {
	assert.deepEqual(bsp(3), [
		{ x: 0, y: 0, w: 55, h: 100 },
		{ x: 55, y: 0, w: 45, h: 50 },
		{ x: 55, y: 50, w: 45, h: 50 },
	])
})

test('the windows cover the area without overlaps', () => {
	for (let count = 1; count <= 6; count++) {
		const area = bsp(count).reduce((sum, r) => sum + r.w * r.h, 0)

		assert.ok(Math.abs(area - 100 * 100) < 1e-6, `${count} windows`)
	}
})

test('focus goes to the nearest window on that side', () => {
	const rects = bsp(3)

	assert.equal(neighbour(rects, 0, 'east'), 1)
	assert.equal(neighbour(rects, 1, 'south'), 2)
	assert.equal(neighbour(rects, 2, 'west'), 0)
	assert.equal(neighbour(rects, 0, 'west'), -1)
})
