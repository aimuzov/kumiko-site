import assert from 'node:assert/strict'
import { test } from 'node:test'

import { random, snapProgress, speckAt, specks } from './dust.ts'

const row = Array.from({ length: 50 }, (_, i) => ({ x: i * 10, y: 0 }))

test('the title stays whole until most of its way across the screen', () => {
	assert.equal(snapProgress(500, 100, 1000), 0)
	assert.equal(snapProgress(1000, 100, 1000), 0)
})

test('the title is gone before it leaves the screen', () => {
	assert.equal(snapProgress(-100, 100, 1000), 1)
	assert.equal(snapProgress(-50, 100, 1000), 1)
})

test('the title crumbles in between', () => {
	const p = snapProgress(-100 + 1100 * 0.24, 100, 1000)

	assert.ok(p > 0 && p < 1)
})

test('the same seed gives the same dust', () => {
	const a = random(7)
	const b = random(7)

	assert.deepEqual([a(), a(), a()], [b(), b(), b()])
})

test('a speck sits in its place at the start and is gone at the end', () => {
	for (const speck of specks(row, 500, 96)) {
		assert.deepEqual(speckAt(speck, 0), { x: speck.x, y: speck.y, alpha: 1, scale: 1 })
		assert.equal(speckAt(speck, 1).alpha, 0)
	}
})

test('the wind carries specks right and up', () => {
	for (const speck of specks(row, 500, 96)) {
		const at = speckAt(speck, 1)

		assert.ok(at.x > speck.x)
		assert.ok(at.y < speck.y)
	}
})

test('the left side starts crumbling before the right one', () => {
	const all = specks(row, 500, 96)
	const average = (part: typeof all) => part.reduce((sum, s) => sum + s.delay, 0) / part.length

	assert.ok(average(all.slice(0, 10)) < average(all.slice(-10)))
})
