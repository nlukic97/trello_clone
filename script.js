var dragged;
var storedList = localStorage.getItem('lists')
var lists;

if(storedList != null){
  lists = JSON.parse(storedList)
} else {
  // for the first initial load just as an example
  lists = {
    backlog: [
      {content:'Users can add a video as their profile picture'},
      {content:'Users can add other users as friends'},
      {content:'Users can publish livestreams'},
      {content:'Users can create groups'},
    ],
    in_progress:[],
    complete:[],
    on_hold:[]
  }
}

Object.keys(lists).forEach(key=>{
  let list = document.querySelector(`.dropzone#${key}`)
  lists[key].forEach(item=>{
    let element = createCard(item.content)
    list.appendChild(element)
  })
})

// functiom to create the card
function createCard(content){
  let element  = document.createElement('div')
  element.classList = 'draggable pr-3 pl-3 pt-1 pb-1 bg-white cursor-move rounded-md'
  element.draggable = 'true'
  element.ondragstart="event.dataTransfer.setData('text/html',null)"
  element.innerText = content
  return element
}




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
  // if (event.target.className == "dropzone") event.target.style.background = "purple";
}, false);



document.addEventListener("dragleave", function(event) {
  // reset background of potential drop target when the draggable element leaves it
  // if (event.target.className == "dropzone") event.target.style.background = "";
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

// Button called to add open the card creation box
document.querySelectorAll('button.add-card-btn').forEach(btn=>{
  btn.addEventListener('click',function(){    
    document.querySelectorAll('.dropzone-container').forEach(container=>{
      container.classList.remove('creating')
    })
    this.parentElement.classList.add('creating')
  })
})

// Click on the 'add' button during card creation
document.querySelectorAll('.insert-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    let value = this.parentElement.parentElement.querySelector('textarea').value
    
    if(value != ''){
      let element = createCard(value)
      this.parentElement.parentElement.parentElement.querySelector('.dropzone').appendChild(element)
      this.parentElement.parentElement.parentElement.classList.remove('creating')
      remakeList()
    }
    
  })
})

// click on the 'cancel' button during card creation
document.querySelectorAll('.cancel-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    this.parentElement.parentElement.parentElement.classList.remove('creating')
  })
})

// When a user types inside a textarea, it will automatically be rezised as the user types to not have a scroll bar
document.querySelectorAll('textarea').forEach(box=>{
  box.addEventListener('input',function(){
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  })
})