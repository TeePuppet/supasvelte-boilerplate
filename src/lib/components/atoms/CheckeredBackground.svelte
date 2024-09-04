<script>
    export let color = 'transparent'

  </script>
  
  <div class="relative w-full rounded-lg overflow-hidden">
    {#if color === "transparent"}
    <div class={`absolute inset-0 bg-white bg-opacity-50 checkered-pattern`}></div>
    {:else}
    <div class={`absolute inset-0`} style={`background-color: ${color}`}></div>
    {/if}
   
    <div class="relative z-10">
      <slot></slot>
    </div>
  </div>
  
  <style lang="postcss">
    .checkered-pattern {
      @apply bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0];
      background-image: 
        linear-gradient(45deg, theme('colors.black') 25%, transparent 25%),
        linear-gradient(-45deg, theme('colors.black') 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, theme('colors.black') 75%),
        linear-gradient(-45deg, transparent 75%, theme('colors.black') 75%);
    }
  </style>
  