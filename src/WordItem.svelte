<script>
  export let word;
  export let isDraggable;

  // Svelte Action for draggable elements
  function makeDraggable(node, params) {
    if (params.shouldBeDraggable) {
      node.draggable = true;
      node.addEventListener("dragstart", handleDragStart);
      node.addEventListener("dragend", handleDragEnd);
    }
    return {
      update(newParams) {
        if (!newParams.shouldBeDraggable) {
          node.draggable = false;
          node.removeEventListener("dragstart", handleDragStart);
          node.removeEventListener("dragend", handleDragEnd);
        } else {
          node.draggable = true;
          node.addEventListener("dragstart", handleDragStart);
          node.addEventListener("dragend", handleDragEnd);
        }
      },
      destroy() {
        if (node.draggable) {
          node.removeEventListener("dragstart", handleDragStart);
          node.removeEventListener("dragend", handleDragEnd);
        }
      },
    };
  }

  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
    event.target.classList.add("shadow-none");
    event.target.classList.add("rounded-none");
  }

  function handleDragEnd(event) {
    event.target.classList.remove("dragging");
    event.target.classList.remove("shadow-none");
    event.target.classList.remove("rounded-none");
  }
</script>

<li
  id={word}
  class="bg-emerald-600 p-4 rounded-xl w-44 mx-auto my-3 shadow-md"
  draggable={isDraggable}
  use:makeDraggable={{
    shouldBeDraggable: isDraggable,
  }}
>
  {word}
</li>
