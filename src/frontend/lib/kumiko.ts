import type { Release } from '@aimuzov/infra-site-kit/changelog.js'

/** Ченжлог для читателя живёт в репо приложения, запись в него пишется в релизный PR. */
const CHANGELOG = 'https://raw.githubusercontent.com/aimuzov/kumiko/main/changelog.json'

export const REPO = 'https://github.com/aimuzov/kumiko'
export const BREW = 'brew install --cask aimuzov/tap/kumiko'

let releases: Promise<Release[]> | undefined

/**
 * Записи ченжлога kumiko, новые сверху. Берутся при сборке, один раз на все страницы: CSP сайта
 * не пускает браузер на чужие адреса. Без файла сборка падает, а не выкатывает пустую историю.
 */
export function kumikoReleases() {
	releases ??= fetch(CHANGELOG).then((response) => {
		if (!response.ok) throw new Error(`${CHANGELOG}: ${response.status}`)

		return response.json() as Promise<Release[]>
	})

	return releases
}

/** Самый свежий релиз, даже скрытый в ченжлоге, и ссылка на его архив: его и скачивают. */
export async function newestRelease() {
	const [newest] = await kumikoReleases()

	if (!newest) throw new Error(`${CHANGELOG} has no release`)

	const { version } = newest

	return { version, download: `${REPO}/releases/download/v${version}/Kumiko-${version}.zip` }
}
