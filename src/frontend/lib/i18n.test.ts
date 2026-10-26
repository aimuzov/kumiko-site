import assert from 'node:assert/strict'
import { test } from 'node:test'

import { dateLocale, langPaths, strings, t } from './i18n.ts'

test('both languages have the same strings', () => {
	assert.deepEqual(Object.keys(strings.en).sort(), Object.keys(strings.ru).sort())
})

test('Russian lives at the root and English under /en/', () => {
	assert.deepEqual(
		langPaths().map(({ params }) => params.lang),
		[undefined, 'en'],
	)
})

test('a string fills in its variables and falls back to the kit strings', () => {
	assert.equal(t('en', 'hero.download', { version: 'v1.0.0' }), 'Download v1.0.0')
	assert.equal(t('ru', 'theme.toggle'), 'Сменить тему')
	assert.equal(dateLocale('en'), 'en-US')
})
