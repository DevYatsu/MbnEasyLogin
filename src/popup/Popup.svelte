<script lang="ts">
  import Section from '../components/Section.svelte'
</script>

<main>
  <Section />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;

    --bg-main: '#001d3d';
    --bg-secondary: '#003566';
    --text-main: '#fff';
    --text-secondary: '#ffc300';
  }

  :global(body) {
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
