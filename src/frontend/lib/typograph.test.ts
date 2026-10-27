import assert from 'node:assert/strict'
import { test } from 'node:test'

import { typograph, typographText } from './typograph.ts'

// В ожиданиях "_" -- неразрывный пробел, а "^" -- узкий, чтобы их было видно.
const show = (s: string) => s.replaceAll(' ', '_').replaceAll(' ', '^')
const t = (text: string) => show(typographText(text))
const h = (html: string) => show(typograph(html))

test('short words hold on to the next one, chains included', () => {
	assert.equal(t('Окна встают в стопку под курсором'), 'Окна встают в_стопку под_курсором')
	assert.equal(t('и в фокусе, для всех'), 'и_в_фокусе, для_всех')
})

test('particles hold on to the previous word only', () => {
	assert.equal(t('Можно ли заниматься'), 'Можно_ли заниматься')
	assert.equal(t('Пришла бы ли она'), 'Пришла_бы_ли она')
})

test('numbers: units, digit groups, years, hashes', () => {
	assert.equal(t('Стоит 2 499 ₽ за 60 минут'), 'Стоит 2^499_₽ за_60_минут')
	assert.equal(t('Было 12000 окон в 2024 году'), 'Было 12^000_окон в_2024_году')
	assert.equal(t('коммит a1b2c3d4e512345'), 'коммит a1b2c3d4e512345')
})

test('a phone number stays whole', () => {
	assert.equal(t('Звонок на 8 800 200 01 22'), 'Звонок на_8_800_200_01_22')
})

test('dash, separator, abbreviations, ellipsis', () => {
	assert.equal(t('Рамка переходит — это видно'), 'Рамка переходит_— это видно')
	assert.equal(t('26 октября 2026 · версия 0.2.0'), '26_октября 2026_· версия 0.2.0')
	assert.equal(t('т. е. всё, А. С. Пушкин'), 'т._е. всё, А._С._Пушкин')
	assert.equal(t('Ну... ладно'), 'Ну… ладно')
})

test('typography is idempotent and keeps hand-placed non-breaking spaces', () => {
	const once = typographText('Окна в фокусе — бар покажет 12000 столов')

	assert.equal(typographText(once), once)
	assert.equal(t('в одном файле'), 'в_одном файле')
})

test('HTML: only the text between tags changes', () => {
	assert.equal(
		h('<p title="в доме">в доме</p><script>const a = "в доме"</script>'),
		'<p title="в доме">в_доме</p><script>const a = "в доме"</script>',
	)

	assert.equal(
		h('<style>a { margin: 0 в }</style><!-- в доме -->'),
		'<style>a { margin: 0 в }</style><!-- в доме -->',
	)

	assert.equal(
		h('<code>в доме</code><kbd>и я</kbd><pre>о  нём</pre>'),
		'<code>в доме</code><kbd>и я</kbd><pre>о  нём</pre>',
	)
})

test('HTML: the brew command and code names stay as they are', () => {
	const brew = '<span class="copy__value">brew install --cask aimuzov/tap/kumiko</span>'

	assert.equal(typograph(brew), brew)
	assert.equal(h('<li>Ключ <code>gap = 8</code> в конфиге</li>'), '<li>Ключ <code>gap = 8</code> в_конфиге</li>')
})

test('HTML: text in another language is left alone', () => {
	const clock = '<span class="desktop__clock" data-clock lang="en">Mon 27 Oct  10:24</span>'

	assert.equal(typograph(`<p>в доме ${clock}</p>`), `<p>в доме ${clock}</p>`)
})

test('HTML: a short word before an inline tag holds on, before a block it does not', () => {
	assert.equal(h('<p>код на <a href="/">GitHub</a></p>'), '<p>код на_<a href="/">GitHub</a></p>')
	assert.equal(h('<p>и <i>Vim</i></p>'), '<p>и_<i>Vim</i></p>')
	assert.equal(h('<p>клавиша и <kbd>⌥</kbd></p>'), '<p>клавиша и_<kbd>⌥</kbd></p>')
	assert.equal(h('<li>и в </li><li>доме</li>'), '<li>и_в </li><li>доме</li>')
})

test('HTML: a dash after a closing inline tag holds on, after <br> it opens the line', () => {
	assert.equal(h('<p><b>kumiko</b> — это менеджер</p>'), '<p><b>kumiko</b>_— это менеджер</p>')
	assert.equal(h('<p><kbd>⌥</kbd> — фокус</p>'), '<p><kbd>⌥</kbd>_— фокус</p>')
	assert.equal(h('<p><time>26 октября</time> · версия</p>'), '<p><time>26_октября</time>_· версия</p>')
	assert.equal(h('<p>Привет<br>— Привет</p>'), '<p>Привет<br>— Привет</p>')
	assert.equal(h('<p>\n\t— Привет</p>'), '<p>\n\t— Привет</p>')
})
