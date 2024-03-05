<script>
  import "../app.pcss"
  import { createForm } from 'svelte-forms-lib'
  import { encrypt } from '../hashing'
  import Input from "$lib/components/ui/input/input.svelte"
  import Button from "../components/Button.svelte"
  import CheckBox from "../components/CheckBox.svelte"

  const closeOptions = () => {
    chrome.tabs.getCurrent((tab) => {
      if (tab && tab.id) chrome.tabs.remove(tab.id, () => { });
    })
  }

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

  chrome.storage.local.get(['goToFirstSchoolAutomatically'], (data) => {
    $form.goToFirstSchoolAutomatically = data.goToFirstSchoolAutomatically
  })
</script>

<main class="w-full h-full py-4">
  {#if isSubmitted}
    <div class="container flex justify-center"><Button variant="close" on:click={closeOptions} /></div>
  {:else}
  <div class="container wrapper">
        <form on:submit={handleSubmit} >
            <h1 class="pb-6 text-2xl font-bold text-center">MbnEasyLogin Options</h1>
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
              

              <div class="flex items-center gap-2">
                <CheckBox
                  on:change={handleChange}
                  name="goToFirstSchoolAutomatically"
                  bind:checked={$form.goToFirstSchoolAutomatically}
                  placeholder="Se rediriger directement dans la première école parmi la liste des écoles disponibles"
                  id="goToFirstSchoolAutomatically"
                />
                <div class="grid gap-1.5 leading-none ">
                  <span
                  for="goToFirstSchoolAutomatically"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                  Se rediriger directement dans la première école parmi la liste des écoles disponibles
                  </span>
                </div>
              </div>

              <div class="flex py-6">
                <span class="text-sm text-blue-500"
                >Les informations sensibles sont stockées en toute sécurité dans le stockage de Chrome et ne peuvent en aucun cas être divulguées.</span
              ></div>

              <div><Button variant="beautiful" text="Valider" /></div>
          </form>
          </div>          

  {/if}
</main>

<style lang="postcss">
:global(html){
  @apply w-full h-full m-0 p-0 bg-background text-foreground;
}

:global(body) {
  @apply w-full min-h-full m-0 p-0 bg-background text-foreground flex justify-center;
}

:global(#app) {
  @apply min-h-full w-full;
}

main {
  @apply w-full h-full flex justify-center items-center px-3;
  --color: #E1E1E1;
  background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  background-size: 55px 55px;
}

.wrapper {
  @apply w-full max-w-2xl bg-white py-6 text-lg;
}

.input-wrapper {
  @apply grid w-full max-w-sm items-center gap-1.5 pb-4;
}
</style>