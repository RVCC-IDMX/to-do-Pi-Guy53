console.log("online");

const listCont = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');

const listDisplayCont = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksCont = document.querySelector('[data-list-tasks]');

const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');

const taskTemplate = document.getElementById('task-template');

const LOCAL_STORAGE_LIST_KEY = 'task.list';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listCont.addEventListener('click', e => {

    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
});

tasksCont.addEventListener('click', e => {

    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;

        save();
        renderTasksCount(selectedList);
    }
});

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null;
    saveAndRender();
});

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;

    if (listName == null || listName === '') {
        return;
    }

    const list = createList(listName);

    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
}

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;

    if (taskName == null || taskName === '') {
        return;
    }

    const task = createTask(taskName);

    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId)
    {
        selectedList.tasks.push(task);
    }
    saveAndRender();
});

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}


function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listCont);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);

    if (selectedListId == null) {
        listDisplayCont.style.display = 'none';
    }
    else {
        listDisplayCont.style.display = '';
        listTitleElement.innerText = selectedList.name;

        renderTasksCount(selectedList);
        clearElement(tasksCont);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkBox = taskElement.querySelector('input');
        const label = taskElement.querySelector('label');

        checkBox.id = task.id;
        checkBox.checked = task.complete;
        label.htmlFor = task.id;
        label.append(task.name);
        tasksCont.appendChild(taskElement);
    });
}

function renderTasksCount(selectedList) {
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks";

    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`;
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;

        listElement.classList.add('list-name');
        listElement.innerText = list.name;

        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }

        listCont.appendChild(listElement);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();