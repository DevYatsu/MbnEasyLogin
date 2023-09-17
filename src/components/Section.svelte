<script lang="ts">
  import { connectToMBN } from '../tab'
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
      const {  connected, error: err } = await connectToMBN()

      isLoading = false

      if (connected) {
        buttonText = 'Connected !'
        message = 'Successfully connected'
      } else {
        buttonText = 'Try again !'
        error = err || 'Something went wrong !'
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
