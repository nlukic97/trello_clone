// (function(){
  var dragged;

  var lists = {
    backlog: [
      {'data-id':1,content:'this div is draggable1'},
      {'data-id':2,content:'this div is draggable2'},
      {'data-id':3,content:'this div is draggable3'},
      {'data-id':4,content:'this div is draggable4'},
    ],
    in_progress:[],
    complete:[],
    on_hold:[]
  }

  /* events fired on the draggable target */
  document.addEventListener("drag", function(event) {
    
  }, false);
  
  
  document.addEventListener("dragstart", function(event) {
    dragged = event.target;
    console.log(dragged);
    event.target.classList.add('dragging')
  }, false);
  
  
  
  document.addEventListener("dragend", function(event) {
    // reset the transparency
    event.target.classList.remove('dragging')
    
    // removeFromlist(event.target)
  }, false);
  
  
  // when we drag over each potential dropzone with a dragable element
  document.querySelectorAll('.dropzone').forEach(container=>{
    container.addEventListener('dragover',(event)=>{
      event.preventDefault()

      const afterElement = getDragAfterElement(container,event.clientY)
      // console.log(afterElement);

      if(afterElement.element == null){
        container.appendChild(dragged)
        // console.log(lists[container.getAttribute('id')]);
      } else {
        container.insertBefore(dragged, afterElement.element)
      }
    })
  })
  
  
  function getDragAfterElement(container,y){
    let draggableElements = [... container.querySelectorAll('.draggable:not(.dragging)')]
    
    // checking each element not being dragged to see where we have chosen to drop out dragged element
    return draggableElements.reduce((closest, child, index)=>{
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2 //center of each box
      
      if(offset < 0 && offset > closest.offset){
        return {offset: offset, element: child, index:index}
      } else {
        return closest
      }
    },{offset: Number.NEGATIVE_INFINITY})
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
    }
  }, false);
// }())


function removeFromlist(element){

  for (const list in lists){

    var result = lists[list].filter(item=>{
      return item['data-id'] == element.getAttribute('data-id')
    })

    if(result != null) {
      break;
    }

    console.log(lists[list].indexOf(result));
    
  }

}

function addToList(element){

}