const forceDelete = document.querySelectorAll(".forceDelete")

forceDelete.forEach(forceBtn => {
    forceBtn.addEventListener('click', (e) => {
        const {todoId} = e.target.dataset
        console.log(todoId)
        fetch(`/forceDelete/${todoId}`, {
            method: 'DELETE', // or 'PUT' depending on your API configuration
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
let close_msg = document.querySelector('.close_msg')
let s_container = document.querySelector('.s_container')
close_msg.addEventListener('click',() => {
    s_container.style.display = 'none'
})