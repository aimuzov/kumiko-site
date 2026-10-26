<script lang="ts">
	import '@aimuzov/infra-site-kit/theme-peek.css'
	import { themePeek } from '@aimuzov/infra-site-kit/theme-peek.js'
	import { toggleTheme, watchTheme, type Theme } from '@aimuzov/infra-site-kit/theme.js'
	import Moon from '@lucide/svelte/icons/moon'
	import Sun from '@lucide/svelte/icons/sun'
	import SunMoon from '@lucide/svelte/icons/sun-moon'

	import { THEME_KEY } from '#frontend/lib/theme.ts'

	let { label }: { label: string } = $props()

	let theme = $state<Theme>('auto')

	$effect(() => watchTheme((next) => (theme = next)))
</script>

<button
	class="theme-button"
	type="button"
	aria-label={label}
	title={label}
	onclick={() => toggleTheme({ key: THEME_KEY })}
	{@attach themePeek}
>
	{#if theme === 'light'}
		<Sun size={20} aria-hidden="true" />
	{:else if theme === 'dark'}
		<Moon size={20} aria-hidden="true" />
	{:else}
		<SunMoon size={20} aria-hidden="true" />
	{/if}
</button>

<style>
	.theme-button {
		cursor: pointer;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		color: var(--fg);
		opacity: 0.6;
		background: none;
		transition: opacity 0.2s ease;

		&:hover,
		&:focus-visible {
			opacity: 1;
		}

		&:focus-visible {
			outline: 2px solid var(--accent);
			outline-offset: 2px;
		}
	}
</style>
