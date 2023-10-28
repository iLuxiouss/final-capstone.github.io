const deleteButtons = document.querySelectorAll('.delete_btn');

deleteButtons.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', (e) => {
        const {todoId} = e.target.dataset
        console.log(todoId)
        fetch(`/delete/${todoId}`, {
            method: 'PATCH', // or 'PUT' depending on your API configuration
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        .then(response => response.json())
        .then(data => {
            // Handle success response (if needed)
            console.log(data);
            // Reload the page or update the UI to reflect the updated todo
            // window.location.reload(); // This will reload the entire page
            window.location.reload()
        })
        .catch(error => {
            // Handle error (if needed)
            console.error(error);
        });
    });
});



const complet_btn = document.querySelectorAll('.complet_btn');

complet_btn.forEach(complete => {
    complete.addEventListener('click', (e) => {
        const {todoId} = e.target.dataset
        console.log(todoId)
        fetch(`/completed/${todoId}`, {
            method: 'PATCH', // or 'PUT' depending on your API configuration
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        .then(response => response.json())
        .then(data => {
            // Handle success response (if needed)
            console.log(data);
            // Reload the page or update the UI to reflect the updated todo
            // window.location.reload(); // This will reload the entire page
            window.location.reload()
        })
        .catch(error => {
            // Handle error (if needed)
            console.error(error);
        });
    });
});


const editBtn = document.querySelectorAll('.edit_btn');

function getTargetEdit(target) {
    let input = document.querySelector(`.edit${target}`)
    return input
}
function removeTarget(target) {
    let input = document.querySelectorAll(`.todo_val`)
    input.forEach(element => {
        if(element.classList.contains(`edit${target}`)) {
        element.style.backgroundColor = "#fff"
        element.style.color = "black"
        element.style.pointerEvents = "visible"
        }else {
            element.style.backgroundColor = "transparent"
            element.style.color = "#fff"
            element.style.pointerEvents = "none"
        }
    })
}
function getSaveBtn (target) {
    let saveBtns = document.querySelectorAll(".save_btn")
    saveBtns.forEach(save_btn => {
        if(save_btn.classList.contains(`save_btn${target}`)) {
            save_btn.style.display = 'block'
        }else {
            save_btn.style.display = 'none'
        }
    })
}
function getEditBtn (target) {
    let editBtns = document.querySelectorAll(".edit_btn")
    editBtns.forEach(editbtn => {
        if(editbtn.classList.contains(`edit_btn${target}`)) {
            editbtn.style.display = 'none'
        }else {
            editbtn.style.display = 'block'
        }
    })
}
function tlContainer(target) {
    let t_l_Container = document.querySelectorAll('.todoListContainer')
    t_l_Container.forEach(element => {
        if(element.classList.contains(`todoContainer${target}`)) {
            element.style.zIndex = 5
        }else {
            element.style.zIndex = 1
        }
    })
}
function remove_tlContainer(target) {
    let t_l_Container = document.querySelectorAll('.todoListContainer')
    t_l_Container.forEach(element => {
        element.style.zIndex = 1
    })
}
let todo_helper = document.querySelector('.todo_helper')
let curr_val = ''
let id = ''
editBtn.forEach(edit_btn => {
    edit_btn.addEventListener("click",(e) => {
        console.log('asd')
        const {todoId} = e.target.dataset
        removeTarget(todoId)
        getSaveBtn (todoId)
        getEditBtn(todoId)
        tlContainer(todoId)
        curr_val = document.querySelector(`.edit${todoId}`).value
        id = todoId
        todo_helper.style.display = 'block'
    })
})

let saveBtns = document.querySelectorAll(".save_btn")



saveBtns.forEach(save_btn => {
    save_btn.addEventListener('click', (e) => {
        const {todoId} = e.target.dataset
        console.log(todoId)
        document.querySelector(`.save_btn${todoId}`).style.display = 'none'
        let inputElem = document.querySelector(`.edit${todoId}`)
        inputElem.style.backgroundColor = "transparent"
        inputElem.style.color = "#fff"
        inputElem.style.pointerEvents = "none"
        document.querySelector(`.edit_btn${todoId}`).style.display = "block"
        console.log(inputElem.value)
        fetch(`/editTodo/${todoId}`, {
            method: 'PATCH', // or 'PUT' depending on your API configuration
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newVal: inputElem.value
            })
        })
        .then(response => response.json())
        .then(data => {
            // Handle success response (if needed)
            todo_helper.style.display = 'none'
            remove_tlContainer(todoId)
            console.log(data);
            // Reload the page or update the UI to reflect the updated todo
            window.location.reload(); // This will reload the entire page
        })
        .catch(error => {
            // Handle error (if needed)
            console.error(error);
        });
    })
})

todo_helper.addEventListener('click',() => {
    document.querySelector(`.edit${id}`).value = curr_val
    let inputElem = document.querySelector(`.edit${id}`)
    inputElem.style.backgroundColor = "transparent"
    inputElem.style.color = "#fff"
    inputElem.style.pointerEvents = "none"
    document.querySelector(`.save_btn${id}`).style.display = 'none'
    document.querySelector(`.edit_btn${id}`).style.display = "block"
    todo_helper.style.display = 'none'
})

let close_msg = document.querySelector('.close_msg')
let s_container = document.querySelector('.s_container')
close_msg.addEventListener('click',() => {
    s_container.style.display = 'none'
})