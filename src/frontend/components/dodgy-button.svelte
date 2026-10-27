<script lang="ts">
	import { onMount } from 'svelte'

	type Props = {
		href: string
		label: string
		/** Подписи увёрток по порядку, после последней кнопка сдаётся. */
		dodges: string[]
	}

	const { href, label, dodges }: Props = $props()

	// Кнопка дразнит мышь, как окно, которое kumiko перекладывает на соседнее место: уходит
	// влево, вправо и снова влево, а с четвёртой попытки возвращается и даёт себя нажать.
	// На тач-экранах и с клавиатуры это обычная ссылка.
	const sides = [-1, 1, -1]

	let button: HTMLAnchorElement
	let enabled = false
	let tries = $state(0)
	let transform = $state('')
	// Возвращает кнопку на место, если курсор за ней больше не гонится.
	let homing: ReturnType<typeof setTimeout> | undefined
	const text = $derived(tries > 0 && tries <= dodges.length ? dodges[tries - 1] : label)

	onMount(() => {
		enabled =
			matchMedia('(hover: hover) and (pointer: fine)').matches &&
			!matchMedia('(prefers-reduced-motion: reduce)').matches

		return () => clearTimeout(homing)
	})

	function dodge(event: PointerEvent) {
		if (!enabled || event.pointerType !== 'mouse' || tries > dodges.length) return

		clearTimeout(homing)

		if (tries++ === dodges.length) {
			transform = ''

			return
		}

		const side = sides[(tries - 1) % sides.length]
		// Так далеко, как позволяет секция, чтобы кнопка оставалась на виду. Мерить по родителю
		// нельзя: это обёртка острова Astro, у неё нет ширины.
		const room = (button.closest('section') ?? document.body).clientWidth / 2 - button.offsetWidth / 2 - 16
		const x = side * Math.min(room, 320) * (0.75 + Math.random() * 0.25)
		// На узком экране шаг вбок короткий, поэтому кнопка ещё и прыгает вниз из-под курсора.
		const y = Math.abs(x) < button.offsetWidth ? 70 : (Math.random() - 0.5) * 60

		transform = `translate(${x | 0}px, ${y | 0}px) rotate(${side * 4}deg)`
		homing = setTimeout(() => (transform = ''), 3000)
	}
</script>

<a
	class="dodgy"
	class:dodgy--caught={tries > dodges.length}
	{href}
	style:transform={transform || undefined}
	bind:this={button}
	onpointerenter={dodge}>{text}</a
>

<style>
	.dodgy {
		display: inline-flex;
		padding: 16px 30px;
		border-radius: 999px;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--on-accent);
		text-decoration: none;
		background: var(--accent);
		box-shadow: 0 12px 32px color-mix(in srgb, var(--accent) 40%, transparent);
		transition:
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			filter 0.2s ease;

		&:hover {
			filter: brightness(1.08);
		}

		&:focus-visible {
			outline: 2px solid var(--accent);
			outline-offset: 3px;
		}

		/* Поймали: кнопка напоследок подпрыгивает, сдаваясь */
		&--caught {
			animation: caught 0.45s ease;
		}
	}

	@keyframes caught {
		40% {
			transform: scale(1.12);
		}
	}
</style>
