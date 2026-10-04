const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const emptyState = document.getElementById("emptyState");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

// Add task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    };

    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";
    priorityInput.value = "medium";

    renderTasks();
});

// Save tasks
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {

    const searchText = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    taskList.innerHTML = "";

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task-item ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `
            <div class="task-main">

                <button
                    class="check-btn"
                    onclick="toggleTask(${task.id})"
                    aria-label="Complete task"
                >
                    ${task.completed ? "✓" : ""}
                </button>

                <div>
                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-date">
                        Created: ${task.createdAt}
                    </div>
                </div>

            </div>

            <div>
                <span class="priority ${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskElement);
    });

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStats();
}

// Toggle completed
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Update statistics
function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

// Search
searchInput.addEventListener("input", renderTasks);

// Filter
filterSelect.addEventListener("change", renderTasks);

// Protect task text from HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// Initial render
renderTasks();