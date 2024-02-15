<script>
  import "../app.pcss"
  import { createForm } from 'svelte-forms-lib'
  import Card from '../components/Card.svelte'
  import Backbutton from '../components/Backbutton.svelte'
  import { encrypt } from '../hashing'
  import Input from "$lib/components/ui/input/input.svelte"
  import Button from "../components/Button.svelte"

  let isSubmitted = false
  let initialValues = {
    username: '',
    password: '',
    goToFirstSchoolAutomatically: false,
  }

  const { form, errors, handleChange, handleSubmit } = createForm({
    initialValues,
    onSubmit: async (values) => {
      values.password = await encrypt(values.password.trim())
      values.username = await encrypt(values.username.trim())

      await chrome.storage.local.set(values)
      await chrome.storage.local.remove('credentialsError')

      isSubmitted = true
    },
    validate: (values) => {
      let errors = {}
      if (values.username === '') {
        errors['username'] = "Votre nom d'utilisateur est requis"
      }
      if (values.password === '') {
        errors['password'] = 'Votre mot de passe est requis'
      }
      return errors
    },
  })

  chrome.storage.local.get(['username', 'password', 'goToFirstSchoolAutomatically'], (data) => {
    $form.username = data.username
    $form.password = data.password
    $form.goToFirstSchoolAutomatically = data.goToFirstSchoolAutomatically
  })
</script>

<main>
  {#if isSubmitted}
    <div class="container"><Backbutton on:click={() => (isSubmitted = false)} /><Card /></div>
  {:else}
  <div class="wrapper container">
        <form on:submit={handleSubmit} >
            <h1 class="text-2xl font-bold pb-6 text-center">MbnEasyLogin Options</h1>
            <div class="input-wrapper">
                <span for="username">Nom d'utilisateur</span>
                <Input
                placeholder="Nom d'utilisateur"
                required=""
                type="text"
                name="username"
                id="username"
                on:change={handleChange}
                bind:value={$form.username}
              />
            {#if $errors.username}
                <small class="text-sm text-red-600">{$errors.username}</small>
              {:else}
            <p class="text-sm text-muted-foreground">Entrer votre nom d'utilisateur MBN.</p>
              {/if}
            </div>

            <div class="input-wrapper">
                <span for="password">Password</span>
                <Input
                placeholder="Mot de Passe"
                required=""
                name="password"
                id="password"
                type="password"
                on:change={handleChange}
                bind:value={$form.password}
              />
              {#if $errors.password}
                <small class="text-sm text-red-600">{$errors.password}</small>
              {:else}
              <p class="text-sm text-muted-foreground">Entrer votre mot de passe MBN.</p>
              {/if}
            </div>
              

              <div class="flex gap-2">
                <input type="checkbox"
                  on:change={handleChange}
                  name="goToFirstSchoolAutomatically"
                  bind:checked={$form.goToFirstSchoolAutomatically}
                  placeholder="Se rediriger directement dans la première école parmi la liste des écoles disponibles"
                  id="goToFirstSchoolAutomatically"
                />
                <div class="grid gap-1.5 leading-none">
                  <span
                  for="goToFirstSchoolAutomatically"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                  Se rediriger directement dans la première école parmi la liste des écoles disponibles
                  </span>
                </div>
              </div>

              <div class="flex py-6">
                <span class="text-sm text-red-500"
                >Les informations sensibles sont stockées en toute sécurité dans le stockage de Chrome et ne peuvent en aucun cas être divulguées.</span
              ></div>

                <Button variant="beautiful" text="Valider"/>
          </form>
          </div>          

  {/if}
</main>

<style lang="postcss">
:global(body), :global(html){
  @apply w-full h-full m-0 p-0 bg-[#f2f2f9] text-[#383838];
}

:global(#app) {
  @apply h-full;
}

main {
  @apply w-full h-full flex justify-center items-center px-3;
}

.wrapper {
  @apply w-full  max-w-2xl bg-white py-6 text-lg;
}

.input-wrapper {
  @apply grid w-full max-w-sm items-center gap-1.5 pb-4;
}

</style>