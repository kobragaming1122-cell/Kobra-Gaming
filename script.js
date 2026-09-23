const STORAGE_KEY = 'taskflow-todos';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const taskCount = document.querySelector('#task-count');
const clearCompletedButton = document.querySelector('#clear-completed');
const clearAllButton = document.querySelector('#clear-all');
const filterButtons = document.querySelectorAll('.filter-button');

let todos = loadTodos();
let currentFilter = 'all';

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function visibleTodos() {
  if (currentFilter === 'active') return todos.filter((todo) => !todo.completed);
  if (currentFilter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

function render() {
  list.replaceChildren();
  const filteredTodos = visibleTodos();

  filteredTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as complete`);
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Delete "${todo.text}"`);
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  taskCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
  emptyState.hidden = filteredTodos.length !== 0;
  emptyState.textContent = todos.length === 0
    ? 'No tasks here yet. Add one to get started!'
    : `No ${currentFilter} tasks right now.`;
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
  clearAllButton.disabled = todos.length === 0;

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function addTodo(text) {
  todos.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  form.reset();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    render();
  });
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

clearAllButton.addEventListener('click', () => {
  if (todos.length && confirm('Delete all tasks?')) {
    todos = [];
    saveTodos();
    render();
  }
});

render();
