<script lang="ts">
  import { connectToMBN } from '../tab'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'

  let error = ''
  let message = ''
  let isLoading = false
  let buttonText = 'Connect'

  async function handleClick() {
    isLoading = true
    try {
      const { tabId, connected, error: err } = await connectToMBN()

      isLoading = false

      if (connected) {
        buttonText = 'Connected !'
        message = 'Successfully connected'

        if (tabId) {
          await chrome.tabs.update(tabId, { selected: true })
        }
      } else {
        buttonText = 'Try again !'
        error = err || 'Something went wrong !'

        if (tabId) {
          await chrome.tabs.remove(tabId)
        }
      }
    } catch (e) {
      error = 'Error occurred while connecting' // Handle errors if any
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
{/if}

<style lang="scss">
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
