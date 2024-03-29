<script>
  import { onMount } from "svelte";
  import WordItem from "./WordItem.svelte";
  import { sendData, showPorts, selectPort } from "./lib/web_serial";
  import { sendPort } from "./lib/backend_serial";
  import cloud_bg from "/cloud_bg.mp4";
  import cloud_win from "/cloud_win.mp4";
  import win_sound from "/ps1.opus";
  import success_sound from "/blip.ogg";

  // disable right click
  [...document.querySelectorAll(".js-noMenu")].forEach((el) =>
    el.addEventListener("contextmenu", (e) => e.preventDefault())
  );

  // disable multi-touch
  function touchHandler(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }
  window.addEventListener("touchstart", touchHandler, false);

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
  function fillTodosLosItems() {
    nube.forEach((nubeItem) => {
      nubeItem.items.forEach((item) => {
        todosLosItems.push(item);
      });
    });
  }
  fillTodosLosItems();

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

  let winDiv;

  function winGame() {
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
    const winSound = document.getElementById("winSound");
    // @ts-ignore
    winSound.play();
    sendData(100);
  }

  // Check if game is won
  function checkWin() {
    if (todosLosItems.length === 0) {
      winGame();
    }
  }

  // Reset the game
  function resetGame() {
    console.log("Resetting game...");
    droppedItems = [];
    droppedItemsPerCategory = {
      P2P: [],
      RRHH: [],
      "ORDER TO CASH": [],
      "CUSTOMER EXPERIENCE": [],
    };
    fillTodosLosItems();
    const winVideo = document.getElementById("winVideo");
    winVideo.classList.add("hidden");
    winDiv.classList.add("-z-30");
    winDiv.classList.add("hidden");
    winDiv.classList.remove("z-30");
    const winTextBg = document.getElementById("winTextBG");
    winTextBg.classList.remove("animate-bounce");
  }

  // Toggles serial port menu
  // on Chrome shows native dialog,
  // on Firefox shows dialog with select
  async function serialPortMenu() {
    await showPorts();
    // show Firefox picker
    document.getElementById("portPicker").classList.remove("hidden");
  }
  function selectSerialPort() {
    // @ts-ignore
    const port = document.getElementById("portPicker").value;
    console.log("Selected port:", port);
    // if Firefox
    if (!("serial" in navigator)) {
      sendPort(port);
      selectPort(port);
      document.getElementById("serialPortMenu").classList.add("hidden");
    }
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
      const successSound = document.getElementById("successSound");
      // @ts-ignore
      successSound.play();
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
    <audio id="winSound" src={win_sound}></audio>
    <audio id="successSound" src={success_sound}></audio>
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

  <!-- overlay -->
  <div class="fixed right-0 bottom-0 min-w-full min-h-full -z-20">
    <div
      class="fixed right-0 bottom-0 min-w-full min-h-full -z-10 transition-opacity bg-green-500 {shouldAnimate
        ? 'opacity-20'
        : 'opacity-0'}"
    ></div>
    <!-- bg -->
    <video
      autoplay
      muted
      loop
      id="myVideo"
      class="fixed right-0 top-0 min-w-full min-h-full -z-20 {shouldAnimate
        ? 'animate-bounce-zoom ring-4'
        : ''}"
    >
      <source src={cloud_bg} type="video/mp4" />
    </video>
  </div>
  <!-- titulos -->
  <div class="fixed top-10 right-10 hidden">
    <h1 class="text-right font-mono text-cyan-300">
      Bienvenidos a Cloud Escape!
    </h1>
    <h2 class="text-right font-mono text-cyan-600 mt-3">
      Arrastre los conceptos a su correspondiente categoría
    </h2>
  </div>
  <!-- hidden serial menu -->
  <div id="serialPortMenu" class="fixed bottom-2 left-2">
    <button on:click={serialPortMenu} class="text-cyan-900 bg-slate-400">
      S
    </button>
    <!-- serial port picker -->
    <select id="portPicker" class="hidden bg-black text-green-500"></select>
    <!-- serial port select button -->
    <button
      id="portPickerSelect"
      on:click={selectSerialPort}
      class="text-cyan-900 bg-slate-400 hidden"
    >
      Select
    </button>
  </div>

  <!-- to test the game over -->
  <!-- <button on:click={winGame}> GANAR </button> -->

  <div class="flex">
    <!-- Palabras -->
    <div class="mr-4 mb-0 w-96 bg-white bg-opacity-25 rounded-lg p-3">
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
