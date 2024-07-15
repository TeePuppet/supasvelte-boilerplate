<script lang="ts">
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import Sidebar from "./components/Sidebar.svelte"
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";
  </script>



<main class="hidden md:block">
	<div class="border-t">
		<div class="bg-background">
			<div class="grid lg:grid-cols-5">
				<Sidebar class="hidden lg:block" />
				<div class="col-span-3 lg:col-span-4 lg:border-l">
					<div class="h-full px-4 py-4 lg:px-8">
                        <slot/>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>