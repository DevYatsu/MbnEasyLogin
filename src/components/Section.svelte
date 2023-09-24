<script lang="ts">
  import { checkCredentials, clearScriptRunner, createNewTab, setIsScriptRunner } from '../utils'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'
  import OptionsLink from './OptionsLink.svelte'

  let error = ''
  let message = ''
  let isLoading = false
  let buttonText = 'Connect'

  async function handleClick() {
    isLoading = true
    try {
      await setIsScriptRunner()
      await checkCredentials()
      await createNewTab()

      // todo!! still need to add support for going to any place in the website we want through a button
      /*
      if (finalTabCategory) {
            await changeTabUrlParams(extensionGeneratedTabId, finalTabCategory)
          } */
    } catch (e) {
      error = e as string
    } finally {
      isLoading = false
    }
  }
</script>

{#if isLoading}
  <Loader />
{:else}
  <div class="flex-wrapper">
    <Button on:click={handleClick} text={buttonText} />
    {#if error}
      <h4 class="msg error-msg">{error}</h4>
    {:else}
      <h4 class="msg success-msg">{message}</h4>
    {/if}
  </div>
  <div class="options-wrapper"><OptionsLink /></div>
{/if}

<style lang="scss">
  .options-wrapper {
    font-size: 10px;
    position: absolute;
    top: 0px;
    right: -14px;
  }
  .flex-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .msg {
    padding-top: 0.2em;

    &.error-msg {
      color: red;
    }
    &.success-msg {
      color: limegreen;
    }
  }
</style>
