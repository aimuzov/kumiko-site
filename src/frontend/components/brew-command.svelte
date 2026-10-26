<script lang="ts">
	import CopyValue from '@aimuzov/infra-site-kit/ui/copy-value.svelte'

	import { BREW } from '#frontend/lib/kumiko.ts'

	// Обёртка нужна Astro: у CopyValue из infra-site-kit нет сигнатуры для страниц Astro.
	let { locale }: { locale: string } = $props()
</script>

<span class="brew"><CopyValue {locale} value={BREW} /></span>

<style>
	.brew {
		font-family: var(--font-mono);
		font-size: 0.9rem;

		/* Команда целиком влезает в ширину телефона */
		@media (width < 600px) {
			font-size: 0.75rem;
		}
	}
</style>
