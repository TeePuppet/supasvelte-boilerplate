<script lang="ts">
    import { onMount } from 'svelte';
  
    let textarea: HTMLTextAreaElement;
  
    function adjustHeight(): void {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  
    onMount(() => {
      adjustHeight();
    });
  
    function handleInput(): void {
      adjustHeight();
    }
  </script>
  
  <textarea
    bind:this={textarea}
    on:input={handleInput}
    {...$$props}
    rows={1}
  />


  <style>
    textarea {
      resize: none;
    }

    textarea {
        @apply w-full bg-transparent py-2 focus:outline-none;
    }
  </style>

