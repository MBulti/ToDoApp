const todos = document.querySelector('.todo-list');

// real-time listener
db.collection('OrnauDullies').onSnapshot(snapshot => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        //console.log(change.type, change.doc.id, change.doc.data());
        if (change.type === 'added') {
            renderToDo(change.doc.data(), change.doc.id, change.doc.data().IsCompleted);
        }
        else if (change.type === 'removed') {
            renderRemoveToDo(change.doc.id);
        }
        else if (change.type === 'modified') {
            renderChangedToDo(change.doc.id, change.doc.data().IsCompleted)
        }
    });
});


// render recipe data
const renderToDo = (data, id, isChecked) => {
    const html = `
        <div class="todo${isChecked ? " isCompleted" : ""}" data-id="${id}">
            <div class="content">
                <input type="text" class="text" value="${data.Todo}" readonly>
                <img class="check ${isChecked ? "completed" : "open"}" data-id="${id}" src="img/check.png" width="24" height="24">
                <img class="trash" data-id="${id}" src="img/delete.png" width="24" height="24">
            </div>
        </div>
    `;
    todos.innerHTML += html;
};

// remove rendered todo
const renderRemoveToDo = (id) => {
    const todo = document.querySelector(`.todo[data-id=${id}]`);
    todo.remove();
};

const renderChangedToDo = (id, isChecked) => {
    const todo = document.querySelector(`.todo[data-id=${id}]`);
    todo.className = `todo${isChecked ? " isCompleted" : ""}`
    todo.querySelector(`.check`).className = `check ${isChecked ? "completed" : "open"}`
}

// add new todo
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const todo = {
        Todo: form.todotext.value
    };
    db.collection('OrnauDullies').add(todo).catch(err => console.log(err));
    form.todotext.value = '';
});

// remove a todo
todos.addEventListener('click', evt => {
    if (evt.target.tagName === 'IMG') {
        const id = evt.target.getAttribute('data-id');
        console.log(evt.target.className);
        if (evt.target.className == "check open") {
            db.collection('OrnauDullies').doc(id).update({
                IsCompleted: true,
            });
        } else if (evt.target.className == "check completed") {
            db.collection('OrnauDullies').doc(id).update({
                IsCompleted: false,
            });
        } else {
            alert("Zurzeit deaktiviert, bitte direkt an Moritz wenden ;)")
            //db.collection('OrnauDullies').doc(id).delete();
        }
    }
})