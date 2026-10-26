import type { APIRoute } from 'astro'

import { kumikoReleases } from '#frontend/lib/kumiko.ts'

/**
 * Тег релиза kumiko, с ченжлогом которого собран сайт. По нему workflow `kumiko-release` понимает,
 * что у приложения вышла новая версия и сайт пора пересобрать. Берётся самый свежий релиз, даже
 * скрытый от читателя: иначе после скрытого релиза сайт пересобирался бы бесконечно.
 */
export const GET: APIRoute = async () => {
	const [newest] = await kumikoReleases()

	return new Response(newest ? `v${newest.version}\n` : '')
}
