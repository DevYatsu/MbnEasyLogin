<script lang="ts">
  export let text: string = 'Click'
  export let variant: "connect" | "beautiful" | "close" = "connect"
</script>

{#if variant === "connect"}
<button on:click class="connect-button {$$restProps.class}">
  <div class="svg-1">
    <svg
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 58.56 116.18"
      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
      version="1.1"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      ><g id="Layer_x0020_1"
        ><metadata id="CorelCorpID_0Corel-Layer" /><path
          d="M51.68 79.32c-5.6,0.48 -18.01,6.61 -22.08,10.58 -0.8,0.78 -1.48,1.77 -2.33,2.43 0.46,-1.76 1.17,-3.5 1.71,-5.18 2.05,-6.36 0.6,-3.94 6.72,-6.92 4.39,-2.13 7.93,-4.39 11.48,-7.91 2.87,-2.84 6.6,-7.49 8.43,-10.95 -3.22,0.75 -8.91,3.73 -12.2,5.14 -3.4,1.56 -7.64,4.64 -10.05,7.42l1.92 -7.77c0.18,-0.6 12.35,-10.32 15.54,-15.33 3.24,-5.07 5.83,-12.73 7.72,-18.52 -3.83,2.95 -11.19,10.7 -14.1,14.29 -2.1,2.58 -4.06,5.29 -6.05,7.95 0.13,-1.52 1.01,-4.66 1.36,-6.17 2.16,-9.19 5.06,-41.4 -1.01,-48.38 0,3.22 -1.49,12.51 -2.05,15.9 -1.29,7.79 -4.08,25.67 -3.07,33.01l0.47 8.51c0.07,2.12 -0.24,6.17 -1.45,7.91 0,-8.9 -9.67,-35.19 -16.51,-40.2 0,5.82 4.29,23.1 6.2,27.9 1.71,4.29 4.8,10.38 7.54,14 1.93,2.55 2.5,2.41 -0.02,9.43l-3.29 11.08 -3.9 -12.16c-2.78,-6.77 -11.01,-23.67 -15.86,-26.92 0,11.78 8.37,33.86 19.11,40.13 -0.29,2.07 -3.42,10.31 -4.93,11.77 -1.78,-10.97 -7.2,-20.86 -13.98,-29.49l-7.03 -8.05c0.06,2.73 1.9,7.3 2.51,10.1 0.36,0.47 3.98,11.12 9.2,19.09 2.49,3.81 6.41,7.11 8.48,10.28 -1.04,3.19 -5.75,9.78 -8.03,12.98l1.81 0.91c2.75,-2.62 8.6,-12.41 9.74,-15.89 6.1,-3.14 7.06,-2.33 14.56,-7.45 5.18,-3.54 5.49,-4.51 8.86,-8.02 1.06,-1.1 4.21,-4.24 4.55,-5.5z"
          class="fil0"
        /></g
      ></svg
    >
  </div>
  <p>{text}</p>
</button>
{:else if variant === "beautiful"}
<button
  on:click
  class="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group {$$restProps.class}"
>
  {text}
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"
  ></span>
  <span
    class="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10"
    >{text}</span
  >
</button>
{:else if variant === "close"}
<button
  on:click
  class="relative border-2 border-black group hover:border-green-500 w-12 h-12 duration-500 overflow-hidden {$$restProps.class}"
  type="button"
>
  <p
    class="font-Manrope text-3xl h-full w-full flex items-center justify-center text-black duration-500 relative z-10 group-hover:scale-0"
  >
    ×
  </p>
  <span
    class="absolute w-full h-full bg-green-500 rotate-45 group-hover:top-9 duration-500 top-12 left-0"
  ></span>
  <span
    class="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:left-9 duration-500 left-12"
  ></span>
  <span
    class="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:right-9 duration-500 right-12"
  ></span>
  <span
    class="absolute w-full h-full bg-green-500 rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"
  ></span>
</button>
{/if}

<style>
  .connect-button {
    user-select: none;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0;
    min-width: 135px;
    height: 65px;
    background: transparent;
    font-size: 17px;
    border: 1px solid #ffffff1c;
    border-radius: 8px;
    box-shadow: inset 0 0 10px #ffffff1c;
  }

  .connect-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 135px;
    height: 65px;
    background: radial-gradient(circle at 100% -50%, #ffffff69 45%, #d4d4d44f 60%, #ffffff36 2%);
    /* background-size: 200%; */
    background-repeat: no-repeat;
    filter: opacity(0.3) blur(0.3em);
  }

  .connect-button::after {
    content: '';
    position: absolute;
    top: 120%;
    left: 0;
    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
    height: 100%;
    width: 100%;
    background-color: #fbfd7b;
    filter: blur(2em);
    opacity: 0;
    pointer-events: none;
  }

  .connect-button p {
    display: inline-block;
    min-width: 135px;
    line-height: 65px;
    font-size: 17px;
    font-weight: 900;
    color: #d6d6d6;
    filter: blur(0.02em);
    z-index: 5;
    padding: 0 6px;
  }

  .connect-button .svg-1 {
    position: absolute;
    top: 50%;
    left: 20%;
    transform: translate(0, -50%) rotate(45deg);
    width: 2.5rem;
    height: auto;
    filter: blur(0.1rem) opacity(0.5);
    z-index: -5;
  }

  .fil0 {
    fill: #935e28;
  }

  .connect-button:hover {
    filter: blur(0.05em);
    animation: lightBox 1s ease-in-out forwards;
  }

  .connect-button:hover::after {
    animation: light 1s ease-in-out forwards;
  }

  .connect-button:hover p {
    animation: lightText 1s ease-in-out forwards;
  }

  @keyframes lightBox {
    0% {
      border: 1px solid #fbfd7b;
      box-shadow: 0 0 5px 0px #fbfd7b8a, inset 0 0 10px #fbfd7b8a;
    }

    20% {
      border: 1px solid #ffffff1c;
      box-shadow: none;
    }

    30% {
      border: 1px solid #fbfd7b;
      box-shadow: 0 0 10px 0px #fbfd7b8a, inset 0 0 15px #fbfd7b8a;
    }

    38% {
      border: 1px solid #ffffff1c;
      box-shadow: none;
    }

    45% {
      border: 1px solid #fbfd7b;
      box-shadow: 0 0 15px 0px #fbfd7b8a, inset 0 0 20px #fbfd7b8a;
    }

    50% {
      border: 1px solid #ffffff1c;
      box-shadow: none;
    }

    53% {
      border: 1px solid #fbfd7b;
      box-shadow: 0 0 15px 0px #fbfd7b8a, inset 0 0 25px #fbfd7b8a;
    }

    65% {
      border: 1px solid #ffffff1c;
      box-shadow: none;
    }

    100% {
      border: 1px solid #fbfd7b;
      box-shadow: 0 0 15px 0px #fbfd7b8a, inset 0 0 25px #fbfd7b8a;
    }
  }

  @keyframes light {
    0% {
      opacity: 0.7;
    }

    20% {
      opacity: 0;
    }

    30% {
      opacity: 0.7;
    }

    38% {
      opacity: 0;
    }

    45% {
      opacity: 0.7;
    }

    50% {
      opacity: 0;
    }

    53% {
      opacity: 0.7;
    }

    65% {
      opacity: 0;
    }

    100% {
      opacity: 0.7;
    }
  }

  @keyframes lightText {
    0% {
      color: #fbfd7b;
      text-shadow: 0 0 5px #fbfd7b8a;
    }

    20% {
      color: #ffffff;
      text-shadow: none;
    }

    30% {
      color: #fbfd7b;
      text-shadow: 0 0 10px #fbfd7b8a;
    }

    38% {
      color: #ffffff;
      text-shadow: none;
    }

    45% {
      color: #fbfd7b;
      text-shadow: 0 0 15px #fbfd7b8a;
    }

    50% {
      color: #ffffff;
      text-shadow: none;
    }

    53% {
      color: #fbfd7b;
      text-shadow: 0 0 15px #fbfd7b8a;
    }

    65% {
      color: #ffffff;
      text-shadow: none;
    }

    100% {
      color: #fbfd7b;
      text-shadow: 0 0 15px #fbfd7b8a;
    }
  }
</style>
