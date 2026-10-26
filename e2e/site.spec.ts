import { siteChecks } from '@aimuzov/infra-site-kit/playwright/checks'

// Проверки, общие для всех сайтов: страницы из sitemap, 404 и axe.
// В sitemap шаблона одна главная, подсказать по опечатке нечего: со второй страницей
// `suggest: false` убирается.
siteChecks({ notFound: { suggest: false } })
