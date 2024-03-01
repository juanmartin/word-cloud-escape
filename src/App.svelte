<script>
  import { onMount } from "svelte";
  import WordItem from "./WordItem.svelte";
  import { sendData } from "./lib/serial";
  import cloud_video from "/cloud_video.mp4";

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
    }, 500);
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
      alert("Ganaste!");
      sendData(100);
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
      handleAnimation();
      checkWin();
    } else {
      console.log("Incorrect category for", itemId);
      shouldAnimate = false;
    }
  }
</script>

<main>
  <div
    class="fixed right-0 bottom-0 min-w-full min-h-full -z-10 {shouldAnimate
      ? 'overlay'
      : ''}"
  >
    <video
      autoplay
      muted
      loop
      id="myVideo"
      class="fixed right-0 bottom-0 min-w-full min-h-full -z-10 {shouldAnimate
        ? 'animate-bounce-zoom ring-4 overlay'
        : ''}"
    >
      <source src={cloud_video} type="video/mp4" />
    </video>
  </div>

  <h1>Bienvenidos a Cloud Escape!</h1>
  <p>Arrastre los conceptos a su correspondiente categoría.</p>

  <div class="flex m-2">
    <!-- Palabras -->
    <div id="draggable" class="mr-2 max-w-sm">
      <h2
        class="bg-cyan-500 p-4 border-cyan-800 border-solid border-2 font-bold"
      >
        Conceptos
      </h2>
      <ul class="list-none flex flex-wrap">
        {#each todosLosItems.sort(() => Math.random() - 0.5) as word (word)}
          <WordItem {word} isDraggable={!droppedItems.includes(word)} />
        {/each}
      </ul>
    </div>
    <!-- Tabla -->
    <div class="">
      <table class="w-full">
        <tr>
          {#each nube as columna}
            <th
              class="droppable bg-cyan-500 p-4 border-cyan-800 border-solid border-2 font-bold w-80"
            >
              {columna.category}
            </th>
          {/each}
        </tr>
        <tr class="h-96">
          {#each nube as columna}
            <td
              id={columna.category}
              class="droppable border-2 border-gray-300 list-none align-top"
            >
              <div id={columna.category} class="h-full w-full grid">
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
