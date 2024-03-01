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
  }

  function handleDragEnd(event) {
    event.target.classList.remove("dragging");
  }
</script>

<li
  id={word}
  class="bg-emerald-600 p-4 border-emerald-800 border-solid border-2 rounded-xl m-3"
  draggable={isDraggable}
  use:makeDraggable={{
    shouldBeDraggable: isDraggable,
  }}
>
  {word}
</li>
