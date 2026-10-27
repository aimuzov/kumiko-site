import { defineMiddleware } from 'astro:middleware'

import { typograph } from '#frontend/lib/typograph.ts'

// Каждая русская страница при сборке проходит через типограф, поэтому и текст,
// который приходит из infra-site-kit и changelog.json kumiko, будет оформлен
// правильно. Английские страницы набираются по своим правилам, их не трогаем.
const RU = /<html\b[^>]*\blang="ru"/i

export const onRequest = defineMiddleware(async (_, next) => {
	const response = await next()

	if (!response.headers.get('content-type')?.startsWith('text/html')) return response

	const html = await response.text()

	if (!RU.test(html)) return new Response(html, response)

	const headers = new Headers(response.headers)

	// После типографа тело другой длины, старый `content-length` уже неверен.
	headers.delete('content-length')

	return new Response(typograph(html), {
		status: response.status,
		statusText: response.statusText,
		headers,
	})
})
