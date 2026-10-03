// Student Task Manager - logic will be added in feature branches
let tasks = [];
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  if (!title) return;
  tasks.push({ id: Date.now(), title: title, desc: desc, done: false });
  form.reset();
  renderTasks();
});

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach(function (t) {
    const li = document.createElement("li");
    li.className = "task" + (t.done ? " done" : "");
    li.innerHTML =
      "<div><strong>" + t.title + "</strong><p>" + t.desc + "</p></div>" +
      "<div><button onclick='toggleTask(" + t.id + ")'>Done</button> " +
      "<button onclick='deleteTask(" + t.id + ")'>Delete</button></div>";
    list.appendChild(li);
  });
}

function toggleTask(id) {
  tasks = tasks.map(function (t) { return t.id === id ? { id: t.id, title: t.title, desc: t.desc, done: !t.done } : t; });
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  renderTasks();
}