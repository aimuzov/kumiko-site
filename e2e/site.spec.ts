import { siteChecks } from '@aimuzov/infra-site-kit/playwright/checks'

// Проверки, общие для всех сайтов: страницы из sitemap, 404 и axe.
// Огромные буквы заголовков -- картинка под контентом, сам заголовок для скринридера рядом.
siteChecks({ a11y: { exclude: ['.big-title__text'] } })
