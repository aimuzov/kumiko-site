import { t as kitT, LOCALES, type Locale } from '@aimuzov/infra-site-kit/i18n.js'

/** Строки сайта поверх общих из infra-site-kit. Русский -- язык по умолчанию, в нём каждый ключ. */
export const strings = {
	ru: {
		'site.description':
			'kumiko, тайлинговый менеджер окон для macOS: рабочие столы, хоткеи и бар в одном приложении',
		'header.home': 'kumiko, на главную',
		'nav.label': 'Разделы',
		'nav.features': 'Возможности',
		'nav.steps': 'Как начать',
		'nav.install': 'Установка',
		'nav.source': 'Исходники на GitHub',
		'nav.download': 'Скачать',

		'hero.tagline': 'Тайлинговый менеджер окон для macOS',
		'hero.lead':
			'Окна, рабочие столы, хоткеи и бар в одном приложении. Всё настраивается в окне настроек или в одном файле kumiko.toml.',
		'hero.download': 'Скачать {version}',
		'hero.requires': 'macOS 14 и новее',
		'hero.brew': 'Через Homebrew',
		'hero.hint':
			'Попробуй: <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd> двигают фокус, <kbd>n</kbd> открывает окно, <kbd>x</kbd> закрывает',
		'hero.demo':
			'Рабочий стол с kumiko: окна стоят плиткой, новое окно делит место соседнего, рамка фокуса переходит между ними, внизу бар с рабочими столами',

		'merge.title': 'Одно приложение вместо шести',
		'merge.lead':
			'Плитку, хоткеи, бар, рамку, прятки значков строки меню и Vim обычно собирают из отдельных утилит. В kumiko это один процесс и один файл настроек.',
		'merge.windows': 'окна',
		'merge.hotkeys': 'хоткеи',
		'merge.bar': 'бар',
		'merge.borders': 'рамка',
		'merge.menubar': 'строка меню',
		'merge.vim': 'Vim',

		'features.title': 'Что умеет',
		'workspaces.title': 'Рабочие столы на каждом экране',
		'workspaces.text':
			'Приложения сами открываются на своём столе и встают в том порядке, в каком ты их перечислил. Стол живёт на основном или внешнем экране и раскладывает окна плиткой, стопкой или оставляет плавать.',
		'rules.title': 'Правила для окон',
		'rules.text':
			'Что встаёт плиткой, а что плавает, решают правила по приложению, заголовку и идентификатору окна. Окна настроек и окна, у которых нельзя менять размер, плавают сами.',
		'hotkeys.title': 'Хоткеи с режимами',
		'hotkeys.text':
			'Сочетания пишутся как в skhd и держатся за положение клавиш, поэтому работают на любой раскладке. Есть режимы, переназначение клавиш и запрет системных сочетаний.',
		'bar.title': 'Бар вместо строки меню',
		'bar.text':
			'Столы с иконками приложений, которые растут под курсором, как в Dock, время, батарея и раскладка. Клик по столу показывает его, по иконке — окно приложения.',
		'bar.strip': 'Бар с рабочими столами и иконками их приложений',
		'borders.title': 'Рамка вокруг окна в фокусе',
		'borders.text': 'Цветом акцента системы или своим. Углы рамки повторяют радиус окна.',
		'vim.title': 'Vim в любом текстовом поле',
		'vim.text':
			'Режимы Vim в полях любых приложений, и на русской раскладке тоже. В терминалах и редакторах со своим Vim их можно выключить.',

		'steps.title': 'Три шага',
		'steps.install.title': 'Поставь',
		'steps.install.text': 'Одна команда в терминале. Cask заодно кладёт команду kumiko в PATH.',
		'steps.allow.title': 'Разреши',
		'steps.allow.text': 'Универсальный доступ, чтобы раскладывать окна, и мониторинг ввода для хоткеев и Vim.',
		'steps.allow.access': 'Универсальный доступ',
		'steps.allow.input': 'Мониторинг ввода',
		'steps.tile.title': 'Работай',
		'steps.tile.text': 'Окна сами встают по местам, а остальное настраивается в окне настроек или в kumiko.toml.',

		'final.title': 'Разложи свои окна',
		'final.done': 'Твой рабочий стол следующий',

		'install.title': 'Установка',
		'install.brew': 'Через Homebrew. Cask заодно кладёт команду kumiko в PATH.',
		'install.zip':
			'Или скачай архив, распакуй и перенеси Kumiko.app в Программы. Приложение пока не нотаризовано: в первый раз открой его, а потом нажми «Всё равно открыть» в настройках «Конфиденциальность и безопасность».',
		'install.sip':
			'Всё работает без отключения SIP, кроме выключения теней окон и плавающих окон поверх остальных. Им нужен скрипт в Dock, как у yabai.',

		'changelog.title': 'Что нового',
		'changelog.lead': 'Как менялся kumiko от версии к версии, простыми словами.',
		'changelog.toc': 'Версии',
		'changelog.version': 'версия',
		'changelog.link': 'Что нового',
		back: 'На главную',
	},
	en: {
		'site.description': 'kumiko, a tiling window manager for macOS: workspaces, hotkeys and a bar in one app',
		'header.home': 'kumiko, home',
		'nav.label': 'Sections',
		'nav.features': 'Features',
		'nav.steps': 'Get started',
		'nav.install': 'Install',
		'nav.source': 'Source on GitHub',
		'nav.download': 'Download',

		'hero.tagline': 'A tiling window manager for macOS',
		'hero.lead':
			'Windows, workspaces, hotkeys and a bar in one app. Set it all up in the settings window or in one kumiko.toml file.',
		'hero.download': 'Download {version}',
		'hero.requires': 'macOS 14 or later',
		'hero.brew': 'With Homebrew',
		'hero.hint':
			'Try it: <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd> move the focus, <kbd>n</kbd> opens a window, <kbd>x</kbd> closes it',
		'hero.demo':
			'A desktop with kumiko: windows tile, a new window splits the place of its neighbour, the focus frame moves between them, and the bar with workspaces runs along the bottom',

		'merge.title': 'One app instead of six',
		'merge.lead':
			'Tiling, hotkeys, a bar, a frame, hiding menu bar icons and Vim usually come from separate tools. In kumiko they are one process and one config file.',
		'merge.windows': 'windows',
		'merge.hotkeys': 'hotkeys',
		'merge.bar': 'bar',
		'merge.borders': 'borders',
		'merge.menubar': 'menu bar',
		'merge.vim': 'Vim',

		'features.title': 'What it does',
		'workspaces.title': 'Workspaces on every display',
		'workspaces.text':
			'Apps open on their own workspace and line up in the order you list them. A workspace lives on the main or the external display and tiles its windows, stacks them or lets them float.',
		'rules.title': 'Window rules',
		'rules.text':
			'Rules by app, title and window identifier decide what tiles and what floats. Settings windows and windows that cannot be resized float by themselves.',
		'hotkeys.title': 'Hotkeys with modes',
		'hotkeys.text':
			'Shortcuts are written the way skhd writes them and stick to key positions, so they work with any input source. There are modes, key remaps and a way to take a system shortcut away.',
		'bar.title': 'A bar in the place of the menu bar',
		'bar.text':
			'Workspaces with app icons that grow under the pointer the way the Dock does, the time, the battery and the input source. A click on a workspace shows it, on an icon brings up the window.',
		'bar.strip': 'The bar with workspaces and the icons of their apps',
		'borders.title': 'A frame around the focused window',
		'borders.text': 'In your accent colour or one of your own. Its corners follow the radius of the window.',
		'vim.title': 'Vim in any text field',
		'vim.text':
			'Vim modes in the text fields of any app, on a Russian layout too. Turn them off in terminals and editors that have a Vim of their own.',

		'steps.title': 'Three steps',
		'steps.install.title': 'Install',
		'steps.install.text': 'One command in the terminal. The cask also puts the kumiko command on the PATH.',
		'steps.allow.title': 'Allow',
		'steps.allow.text': 'Accessibility to arrange windows and Input Monitoring for hotkeys and Vim.',
		'steps.allow.access': 'Accessibility',
		'steps.allow.input': 'Input Monitoring',
		'steps.tile.title': 'Tile',
		'steps.tile.text': 'Windows find their places, and the rest is set in the settings window or in kumiko.toml.',

		'final.title': 'Tile your windows',
		'final.done': 'Your desktop is next',

		'install.title': 'Install',
		'install.brew': 'With Homebrew. The cask also puts the kumiko command on the PATH.',
		'install.zip':
			'Or download the archive, unzip it and move Kumiko.app to Applications. The app is not notarized yet: try to open it once, then press Open Anyway under Privacy & Security in System Settings.',
		'install.sip':
			'Everything works with SIP on but turning window shadows off and keeping floating windows on top. Those need a scripting addition in Dock, as with yabai.',

		'changelog.title': 'What’s new',
		'changelog.lead': 'How kumiko changed from version to version, in plain words.',
		'changelog.toc': 'Versions',
		'changelog.version': 'version',
		'changelog.link': 'What’s new',
		back: 'Home',
	},
}

/** Строка сайта на языке страницы, с подстановкой `{name}`. */
export function t(locale: Locale, key: string, vars?: Record<string, string | number>) {
	return kitT(locale, key, vars, strings)
}

/** Пути страницы на каждом языке: русская в корне, английская под `/en/`. */
export function langPaths() {
	return LOCALES.map((locale) => ({ params: { lang: locale === 'ru' ? undefined : locale }, props: { locale } }))
}

/** Язык дат и записей ченджлога для компонента из infra-site-kit. */
export function dateLocale(locale: Locale) {
	return locale === 'en' ? 'en-US' : 'ru-RU'
}
