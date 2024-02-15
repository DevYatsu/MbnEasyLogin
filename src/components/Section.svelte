<script lang="ts">
  import { checkCredentials, createNewTab, setIsScriptRunner } from '../utils'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'
  import OptionsLink from './OptionsLink.svelte'

  let error = ''
  let message = ''
  let isLoading = false
  let buttonText = 'Se connecter'

  async function handleClick() {
    try {
      await setIsScriptRunner()
      await checkCredentials()
      isLoading = true
      await createNewTab()

      // todo!! still need to add support for going to any place in the website we want through a button
      /*
      if (finalTabCategory) {
            await changeTabUrlParams(extensionGeneratedTabId, finalTabCategory)
          } */
    } catch (e) {
      error = (e as string)
    } finally {
      isLoading = false
    }
  }
</script>

{#if isLoading}
  <Loader />
{:else}
  <div class="flex flex-col">
    <Button on:click={handleClick} text={buttonText} class="w-full" />
    {#if error}
      <h4 class="text-red-500 max-w-32">{error}</h4>
    {:else}
      <h4 class="text-green-500">{message}</h4>
    {/if}</div>
  <div class="absolute text-lg top-0 right-0"><OptionsLink /></div>
{/if}

