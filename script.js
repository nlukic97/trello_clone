var dragged;
var storedList = localStorage.getItem('lists')
var lists;

if(storedList != null){
  lists = JSON.parse(storedList)
} else {
  // for the first initial load just as an example
  lists = {
    backlog: [
      {content:'This is a draggable element. Feel free to add more of your own!'},
      {content:'This is a draggable element. Feel free to add more of your own!'},
      {content:'This is a draggable element. Feel free to add more of your own!'},
      {content:'This is a draggable element. Feel free to add more of your own!'},
    ],
    in_progress:[],
    complete:[],
    on_hold:[]
  }
}

Object.keys(lists).forEach(key=>{
  let list = document.querySelector(`.dropzone#${key}`)
  lists[key].forEach(item=>{
    let element = document.createElement('div')
    element.classList.add('draggable')
    element.draggable = 'true'
    element.ondragstart="event.dataTransfer.setData('text/html',null)"
    element.innerText = item.content
    
    list.appendChild(element)
  })
})




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
}, false);


// when we drag over each potential dropzone with a dragable element
document.querySelectorAll('.dropzone').forEach(container=>{
  container.addEventListener('dragover',(event)=>{
    event.preventDefault()
    const afterElement = getDragAfterElement(container,event.clientY)

    if(afterElement.element == null){
      container.appendChild(dragged)
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

  remakeList()
}, false);


function remakeList(){
  document.querySelectorAll('.elements .dropzone').forEach(list=>{
    let property = list.getAttribute('id')
    lists[property] = [];

    list.querySelectorAll('div.draggable').forEach(item=>{
      lists[property].push({content:item.innerText})
    })

  })

  localStorage.setItem('lists',JSON.stringify(lists))
}