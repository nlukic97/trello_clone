var dragged;

/* events fired on the draggable target */
document.addEventListener("drag", function(event) {

}, false);



document.addEventListener("dragstart", function(event) {
  dragged = event.target;
  event.target.classList.add('dragging')
}, false);



document.addEventListener("dragend", function(event) {
  // reset the transparency
  event.target.classList.remove('dragging')
  // dragged = null
}, false);


// when we drag over each potential dropzone with a dragable element
document.querySelectorAll('.dropzone').forEach(container=>{
  container.addEventListener('dragover',(event)=>{
    event.preventDefault()
    const afterElement = getDragAfterElement(container,event.clientY)

    if(afterElement == null){
      container.appendChild(dragged)
    } else {
      container.insertBefore(dragged, afterElement)
    }
  })
})


function getDragAfterElement(container,y){
  let draggableElements = [... container.querySelectorAll('.draggable:not(.dragging)')]

  // checking each element not being dragged to see where we have chosen to drop out dragged element
  return draggableElements.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2 //center of each box

    if(offset < 0 && offset > closest.offset){
      return {offset: offset, element: child}
    } else {
      return closest
    }
  },{offset: Number.NEGATIVE_INFINITY}).element
}



document.addEventListener("dragenter", function(event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") event.target.style.background = "purple";
}, false);



document.addEventListener("dragleave", function(event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") event.target.style.background = "";
}, false);



document.addEventListener("drop", function(event) {
  event.preventDefault();

  if (event.target.className == "dropzone") {
    event.target.style.background = "";
    // dragged.parentNode.removeChild(dragged);
    // event.target.appendChild( dragged );
  }
}, false);