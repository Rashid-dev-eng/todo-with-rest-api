const token = localStorage.getItem("token");


// =========================================
// ELEMENTS
// =========================================

const todoList =
    document.getElementById("todoList");

const todoForm =
    document.getElementById("todoForm");

const message =
    document.getElementById("message");

const logoutBtn =
    document.getElementById("logoutBtn");

const todoCount =
    document.getElementById("todoCount");

const editModal =
    document.getElementById("editModal");

const editForm =
    document.getElementById("editForm");

const editTitle =
    document.getElementById("editTitle");

const editDescription =
    document.getElementById("editDescription");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// =========================================
// CURRENT EDITING TODO
// =========================================

let editingTodoId = null;


// =========================================
// PROTECT DASHBOARD
// =========================================

if (!token) {

    window.location.href =
        "index.html";

}


// =========================================
// GET TODOS
// =========================================

async function getTodos() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/todos/",
            {
                method: "GET",

                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        // Authentication failed
        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "index.html";

            return;

        }


        const data =
            await response.json();


        console.log(data);


        // Update count
        updateTodoCount(data.length);


        // No todos
        if (data.length === 0) {

            todoList.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-icon">
                        ✓
                    </div>

                    <p>
                        You don't have any todos yet.
                    </p>

                </div>
            `;

            return;

        }


        // Clear list
        todoList.innerHTML = "";


        // Display todos
        data.forEach(function(todo) {

            const todoElement =
                document.createElement("div");


            todoElement.classList.add(
                "todo-item"
            );


            const statusClass =
                todo.completed
                    ? "completed"
                    : "not-completed";


            const statusText =
                todo.completed
                    ? "Completed"
                    : "Not completed";


            const toggleText =
                todo.completed
                    ? "Mark as incomplete"
                    : "Mark as completed";


            todoElement.innerHTML = `

                <h3>
                    ${escapeHTML(todo.title)}
                </h3>


                <p class="todo-description">
                    ${escapeHTML(todo.description)}
                </p>


                <p class="todo-status ${statusClass}">

                    Status:
                    ${statusText}

                </p>


                <div class="todo-actions">

                    <button
                        class="toggle-btn"
                        data-id="${todo.id}"
                        data-completed="${todo.completed}"
                    >
                        ${toggleText}
                    </button>


                    <button
                        class="edit-btn"
                        data-id="${todo.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        data-id="${todo.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            todoList.appendChild(
                todoElement
            );

        });

    } catch (error) {

        console.error(error);


        todoList.innerHTML = `
            <div class="empty-state">

                <p>
                    Unable to connect to the server.
                </p>

            </div>
        `;

    }

}


// =========================================
// TODO COUNT
// =========================================

function updateTodoCount(count) {

    if (count === 1) {

        todoCount.textContent =
            "1 task";

    } else {

        todoCount.textContent =
            `${count} tasks`;

    }

}


// =========================================
// CREATE TODO
// =========================================

todoForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        if (!title || !description) {

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        message.textContent =
            "Creating Todo...";


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/todos/",
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        description: description,
                        completed: false
                    })
                }
            );


            const data =
                await response.json();


            if (response.ok) {

                message.textContent =
                    "Todo created successfully.";

                todoForm.reset();

                await getTodos();

            } else {

                console.log(data);

                message.textContent =
                    "Failed to create Todo.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    }
);


// =========================================
// TOGGLE TODO
// =========================================

async function toggleTodo(
    todoId,
    completed
) {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/todo/${todoId}/`,
            {
                method: "PATCH",

                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    completed: !completed
                })
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "index.html";

            return;

        }


        if (response.ok) {

            await getTodos();

        } else {

            const data =
                await response.json();

            console.log(data);

            message.textContent =
                "Failed to update Todo.";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";

    }

}


// =========================================
// OPEN EDIT MODAL
// =========================================

async function openEditModal(todoId) {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/todo/${todoId}/`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "index.html";

            return;

        }


        if (!response.ok) {

            message.textContent =
                "Unable to load Todo.";

            return;

        }


        const todo =
            await response.json();


        editingTodoId =
            todoId;


        editTitle.value =
            todo.title;


        editDescription.value =
            todo.description;


        editModal.classList.add(
            "show"
        );

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";

    }

}


// =========================================
// CLOSE EDIT MODAL
// =========================================

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );


    editingTodoId =
        null;


    editForm.reset();

}


// =========================================
// SAVE EDITED TODO
// =========================================

editForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!editingTodoId) {

            return;

        }


        const title =
            editTitle.value.trim();


        const description =
            editDescription.value.trim();


        if (!title || !description) {

            return;

        }


        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/todo/${editingTodoId}/`,
                {
                    method: "PATCH",

                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                }
            );


            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href =
                    "index.html";

                return;

            }


            const data =
                await response.json();


            if (response.ok) {

                closeEditModal();


                message.textContent =
                    "Todo updated successfully.";


                await getTodos();

            } else {

                console.log(data);

                message.textContent =
                    "Failed to update Todo.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    }
);


// =========================================
// DELETE TODO
// =========================================

async function deleteTodo(todoId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this Todo?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/todo/${todoId}/`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Token ${token}`
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "index.html";

            return;

        }


        if (response.ok) {

            message.textContent =
                "Todo deleted successfully.";


            await getTodos();

        } else {

            const data =
                await response.json();

            console.log(data);

            message.textContent =
                "Failed to delete Todo.";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";

    }

}


// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener(
    "click",
    async function() {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/logout/",
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            if (response.ok) {

                localStorage.removeItem(
                    "token"
                );


                window.location.href =
                    "index.html";

            } else {

                console.log(
                    "Logout failed."
                );


                message.textContent =
                    "Logout failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    }
);


// =========================================
// HANDLE TODO BUTTONS
// =========================================

todoList.addEventListener(
    "click",
    function(event) {


        // Toggle
        if (
            event.target.classList.contains(
                "toggle-btn"
            )
        ) {

            const todoId =
                event.target.dataset.id;


            const completed =
                event.target.dataset.completed === "true";


            toggleTodo(
                todoId,
                completed
            );

        }


        // Edit
        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            const todoId =
                event.target.dataset.id;


            openEditModal(
                todoId
            );

        }


        // Delete
        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            const todoId =
                event.target.dataset.id;


            deleteTodo(
                todoId
            );

        }

    }
);


// =========================================
// MODAL EVENTS
// =========================================

closeModalBtn.addEventListener(
    "click",
    closeEditModal
);


cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


// Close modal when clicking outside it
editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// Close modal with Escape key
document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains("show")
        ) {

            closeEditModal();

        }

    }
);


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


// =========================================
// INITIAL LOAD
// =========================================

getTodos();