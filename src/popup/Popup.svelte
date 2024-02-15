<script lang="ts">
  import "../app.pcss"
  import Section from '../components/Section.svelte'
</script>

<main>
  <Section />
</main>

<style>
  :global(body), :global(html) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #001d3d;
    color: #fff;    
    min-width: 15rem;
    min-height: 5rem;
}

  main {
    text-align: center;
    padding: 2em;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
