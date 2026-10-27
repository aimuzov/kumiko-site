import { expect, test } from '@playwright/test'

// Язык браузера: без cookie `lang` англоязычного уводит на /en/, русскоязычного и выбравшего
// язык в переключателе -- нет. На сервере то же делает Caddy, здесь проверяется фолбек.
test.describe('en browser', () => {
	test.use({ locale: 'en-US' })

	test('goes to the English version', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL(/\/en\/$/)
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
	})

	test('keeps an explicit choice', async ({ page, context, baseURL }) => {
		await context.addCookies([{ name: 'lang', value: 'ru', url: baseURL }])
		await page.goto('/')
		await expect(page).toHaveURL(/\/$/)
		await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
	})

	test('does not loop on a missing page', async ({ page }) => {
		await page.goto('/missing')
		await expect(page).toHaveURL(/\/en\/missing$/)
	})
})

test.describe('ru browser', () => {
	test.use({ locale: 'ru-RU' })

	test('stays on the Russian version', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL(/\/$/)
		await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
	})
})
