<script>
  import { onMount } from "svelte";

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
      category: "ORDEN TO CASH",
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

  // Set of all items
  let todosLosItems = [];

  nube.forEach((nubeItem) => {
    nubeItem.items.forEach((item) => {
      todosLosItems.push(item);
    });
  });

  onMount(() => {
    const draggableItems = document.querySelectorAll(".draggable");
    const droppableAreas = document.querySelectorAll(".droppable");

    draggableItems.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    });

    droppableAreas.forEach((area) => {
      area.addEventListener("dragover", handleDragOver);
      area.addEventListener("drop", handleDrop);
    });
  });

  function handleDragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  function handleDragEnd(event) {
    event.target.classList.remove("dragging");
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    const itemId = event.dataTransfer.getData("text");
    const item = document.getElementById(itemId);
    event.target.appendChild(item);
    // Here you would check if the item was dropped in the correct column
    console.log("Dropped", itemId, "in", event.target.id);
  }
</script>

<main>
  <div>
    <h1>Bienvenidos a Cloud Escape!</h1>
    <p>Arrastre las palabras a su correspondiente categoría.</p>

    <div class="flex m-2">
      <!-- Palabras -->
      <div id="draggable" class="mr-2">
        <h2 class="bg-cyan-500 p-4 border-cyan-800 border-solid font-bold">
          Conceptos
        </h2>
        <ul>
          {#each todosLosItems.sort(() => Math.random() - 0.5) as word}
            <li
              id="draggable"
              class="draggable bg-emerald-600 p-4 border-emerald-800 border-solid border-2 rounded-xl m-3"
            >
              {word}
            </li>
          {/each}
        </ul>
      </div>
      <!-- Tabla -->
      <div>
        <table style="width: 100%">
          <tr>
            {#each nube as columna}
              <th class="bg-cyan-500 p-4 border-cyan-800 border-solid"
                >{columna.category}</th
              >
            {/each}
          </tr>
          <tr>
            <td id="droppable" class="droppable"></td>
            <td id="droppable" class="droppable"></td>
            <td id="droppable" class="droppable"></td>
            <td id="droppable" class="droppable"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</main>
