<script lang="ts" context="module">
	import { writable, get } from 'svelte/store';

	interface ColorType {
		name: string;
		hex: string;
	}

	export const selectedColorStore = writable<ColorType>({ name: 'Black', hex: '#191919' });

	export function getSelectedColor(): ColorType {
		return get(selectedColorStore);
	}

</script>

<script lang="ts">

	let colors = [
		{ name: 'White', hex: '#FFFFFF' },
		{ name: 'Creme', hex: '#FFFDD0' },
		{ name: 'Black', hex: '#191919' },
		{ name: 'Maroon', hex: '#6C333A' },
		{ name: 'Kelly', hex: '#007948' },
		{ name: 'Navy', hex: '#18263D' },
		{ name: 'Heather', hex: '#D3D3D3' }
	];

	$: selectedColor = colors[2];

	// Subscribe to the store
	selectedColorStore.subscribe((value) => {
		selectedColor = value;
	});

	function selectColor(color: { name: string; hex: string }) {
		selectedColorStore.set(color);
	}


</script>


{#each colors as color}
	<button
		class={`block h-8 w-8 rounded-full border border-white/20 hover:opacity-80 ${selectedColor === color ? 'border-2 border-blue-500' : 'border-black/10'}`}
		style={`background-color: ${color.hex}`}
		title={color.name}
		on:click={() => selectColor(color)}
	></button>
{/each}
