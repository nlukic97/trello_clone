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

document.addEventListener("dragstart", function(event) {
  dragged = event.target;
  event.target.classList.add('dragging')
}, false);


// reset the transparency
document.addEventListener("dragend", function(event) {
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


document.addEventListener("drop", function(event) {
  event.preventDefault();
  updateLocalStorageLists()
}, false);


// Button called to add open the card creation box
document.querySelectorAll('button.add-card-btn').forEach(btn=>{
  btn.addEventListener('click',function(){    
    document.querySelectorAll('.dropzone-container').forEach(container=>{
      container.classList.remove('creating')
    })
    this.parentElement.classList.add('creating')
    this.parentElement.querySelector('textarea').value = ''; //make the value of the textarea input empty if we open/re-open a box
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
      updateLocalStorageLists()
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



/** -------- Methods -------- */
// returns us the element we are hovering behind (or undefined if we aren't hovering our card over another)
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


// updates local storage with the current list as it is
function updateLocalStorageLists(){
  document.querySelectorAll('.elements .dropzone').forEach(list=>{
    let property = list.getAttribute('id')
    lists[property] = [];
    
    list.querySelectorAll('div.draggable span.text-content').forEach(item=>{
      lists[property].push({content:item.innerText})
    })
    
  })
  
  localStorage.setItem('lists',JSON.stringify(lists))
}


// functiom to create the card
function createCard(content){
  let element  = document.createElement('div')
  element.classList = 'draggable pr-3 pl-3 pt-1 pb-1 bg-white cursor-move rounded-md flex justify-between items-start'
  element.draggable = 'true'
  element.ondragstart="event.dataTransfer.setData('text/html',null)"
  // element.innerText = content
  element.innerHTML = `<span class='text-content'>${content}</span>
  <button class="remove-btn bg-red-400 hover:bg-red-300 pr-3 pl-3 pt-1 pb-1 text-white rounded-md" onclick="remove(event)">X</button>`;
  return element
}

//removes a card
function remove(e){
  e.target.parentElement.remove()
  updateLocalStorageLists()
}