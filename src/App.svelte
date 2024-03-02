<script>
  import { onMount } from "svelte";
  import WordItem from "./WordItem.svelte";
  import { sendData, showPorts } from "./lib/serial";
  import cloud_bg from "/cloud_bg.mp4";
  import cloud_win from "/cloud_win.mp4";

  // Data nube sets of phrases
  const nube = [
    {
      category: "P2P",
      items: [
        "Alta proveedores",
        "Gestión de pagos a proveedores",
        "Entrega del bien/servicio",
      ],
    },
    {
      category: "RRHH",
      items: [
        "Búsqueda de personal",
        "Pago de Salarios",
        "Revisiones salariales",
      ],
    },
    {
      category: "ORDER TO CASH",
      items: [
        "Alta de clientes",
        "Contabilización de los pagos",
        "Conciliaciones bancarias",
      ],
    },
    {
      category: "CUSTOMER EXPERIENCE",
      items: [
        "Fidelidad del cliente",
        "Impulso a crecimiento rentable",
        "Automatización y fuerza de venta",
      ],
    },
  ];

  // Array of all items
  let todosLosItems = [];
  nube.forEach((nubeItem) => {
    nubeItem.items.forEach((item) => {
      todosLosItems.push(item);
    });
  });

  let shouldAnimate = false;
  function handleAnimation() {
    shouldAnimate = true;
    setTimeout(() => {
      shouldAnimate = false;
    }, 200);
  }

  let droppedItems = [];

  let droppedItemsPerCategory = {
    P2P: [],
    RRHH: [],
    "ORDER TO CASH": [],
    "CUSTOMER EXPERIENCE": [],
  };

  // Check if game is won
  function checkWin() {
    if (todosLosItems.length === 0) {
      console.log("Game won!");
      const winVideo = document.getElementById("winVideo");
      winVideo.classList.remove("hidden");
      winDiv.classList.remove("-z-30");
      winDiv.classList.remove("hidden");
      winDiv.classList.add("z-30");
      const winTextBg = document.getElementById("winTextBG");
      winTextBg.classList.add("animate-bounce");
      // @ts-ignore
      winVideo.play();
      sendData(100);
    }
  }

  let winDiv;

  function resetGame() {
    console.log("Resetting game...");
    // Reset the game here...
    window.location.reload();
  }

  // For testing purposes
  function winGame() {
    todosLosItems = [];
    checkWin();
  }

  async function connectSerialPort() {
    await showPorts();
  }

  // Check if an item belongs to a category
  function itemBelongsToCategory(item, category) {
    console.log("Checking if", item, "belongs to", category);
    return nube
      .find((nubeItem) => {
        return nubeItem.category === category;
      })
      .items.includes(item);
  }

  onMount(() => {
    const droppableAreas = document.querySelectorAll(".droppable");

    droppableAreas.forEach((area) => {
      area.addEventListener("dragover", handleDragOver);
      area.addEventListener("drop", handleDrop);
    });
  });

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    // Check if the drop target is a droppable zone
    if (!event.target.classList.contains("droppable")) {
      console.log("Drop target is not a droppable zone");
      return;
    }
    const itemId = event.dataTransfer.getData("text/plain");
    const category = event.target.id;
    console.log("Dropped", itemId, "in", category);
    if (itemBelongsToCategory(itemId, category)) {
      droppedItemsPerCategory[category] = [
        ...droppedItemsPerCategory[category],
        itemId,
      ];
      droppedItems = [...droppedItems, itemId];
      todosLosItems = todosLosItems.filter((item) => item !== itemId);
      console.log("droppedItems", droppedItems);
      console.log("Correct category for", itemId, "in", category);
      handleAnimation();
      checkWin();
    } else {
      console.log("Incorrect category for", itemId);
      shouldAnimate = false;
    }
  }
</script>

<main>
  <!-- win -->
  <div
    id="winDv"
    bind:this={winDiv}
    class="fixed right-0 bottom-0 min-w-full min-h-full -z-30 flex items-center justify-center"
  >
    <div
      id="winTextBG"
      class="bg-sky-700 bg-opacity-90 rounded-3xl z-50 p-10 shadow-md"
    >
      <h1
        class="text-6xl z-50 shadow-sm animate-text bg-gradient-to-r from-teal-200 via-blue-200 to-green-200 bg-clip-text text-transparent font-black font-mono"
      >
        Desafío Superado
      </h1>
    </div>
    <video
      muted
      id="winVideo"
      class="fixed hidden right-0 bottom-0 min-w-full min-h-full z-30"
      on:ended={resetGame}
    >
      <source src={cloud_win} type="video/mp4" />
    </video>
  </div>

  <div class="fixed right-0 bottom-0 min-w-full min-h-full -z-20">
    <div
      class="fixed right-0 bottom-0 min-w-full min-h-full -z-10 transition-opacity bg-green-500 {shouldAnimate
        ? 'opacity-50'
        : 'opacity-0'}"
    ></div>
    <!-- bg -->
    <video
      autoplay
      muted
      loop
      id="myVideo"
      class="fixed right-0 bottom-0 min-w-full min-h-full -z-20 {shouldAnimate
        ? 'animate-bounce-zoom ring-4'
        : ''}"
    >
      <source src={cloud_bg} type="video/mp4" />
    </video>
  </div>

  <h1 class="text-right font-mono text-cyan-300">
    Bienvenidos a Cloud Escape!
  </h1>
  <h2 class="text-right font-mono text-cyan-600 mt-3">
    Arrastre los conceptos a su correspondiente categoría
  </h2>

  <!-- hidden button -->
  <button
    on:click={connectSerialPort}
    class="fixed bottom-0 left-0 text-cyan-900">S</button
  >

  <!-- to test the game over -->
  <!-- <button on:click={winGame}> RESET </button> -->

  <div class="flex">
    <!-- Palabras -->
    <div
      id="draggable"
      class="mr-4 -mt-24 w-96 bg-white bg-opacity-25 rounded-lg p-3"
    >
      <h2 class="bg-cyan-600 p-4 font-bold mb-4 rounded-lg shadow-lg">
        Conceptos
      </h2>
      <ul class="list-none flex flex-wrap">
        {#each todosLosItems.sort(() => Math.random() - 0.5) as word (word)}
          <WordItem {word} isDraggable={!droppedItems.includes(word)} />
        {/each}
      </ul>
    </div>
    <!-- Tabla -->
    <div class="flex flex-grow p-3 mt-72 bg-white bg-opacity-25 rounded-lg">
      <table class="w-full">
        <tr class="flex place-content-evenly w-full mx-0">
          {#each nube as columna}
            <th
              class="bg-cyan-600 p-4 border-solid font-bold w-72 rounded-lg flex justify-center shadow-lg"
            >
              {columna.category}
            </th>
          {/each}
        </tr>
        <tr class="flex flex-grow h-96 place-content-evenly">
          {#each nube as columna}
            <td
              id={columna.category}
              class="pt-4 border-gray-300 list-none align-top rounded-lg inline-flex w-72"
            >
              <div
                id={columna.category}
                class="droppable h-96 w-72 border-solid border-2 border-cyan-300 border-opacity-30 rounded-lg"
              >
                {#each droppedItemsPerCategory[columna.category] as item}
                  <WordItem word={item} isDraggable={false} />
                {/each}
              </div>
            </td>
          {/each}
        </tr>
      </table>
    </div>
  </div>
</main>
