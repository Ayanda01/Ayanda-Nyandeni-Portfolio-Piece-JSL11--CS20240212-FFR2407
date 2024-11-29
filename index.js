import {getTasks,createNewTask,patchTask,putTask,deleteTask} from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";
// TASK: import helper functions from utils
// TASK: import initialData

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
hideSideBarBtn:document.getElementById("hide-side-bar-btn"),
showSideBarBtn:document.getElementById("show-side-bar-btn"),
dropdownBtn:document.getElementById("dropdownBtn"),
addNewTaskBtn:document.getElementById("add-new-task-btn"),
editBoardBtn:document.getElementById("edit-Board-btn"),
deleteBoardBtn:document.getElementById("deleteBoardBtn"),
createTaskBtn:document.getElementById("create-task-btn"),
cancelAddTaskBtn:document.getElementById("cancel-add-task-btn"),
editBtn:document.getElementById("edit-btn"),
saveTaskchangeBtn:document.getElementById("ave-task-changes-btn"),
canceleditBtn:document.getElementById("cancel-edit-btn"),
deleteTaskBtn:document.getElementById("delete-task-btn"),
iconDark:document.getElementById("icon-dark"),
logo:document.getElementById("logo"),
iconlight:document.getElementById("icon-light"),
switch:document.getElementById("switch"),
titleinput:document.getElementById("title-input"),
edittasktitleinput:document.getElementById("edit-task-title-input"),
editTaskdescinput:document.getElementById("edit-task-desc-input"),
descinput:document.getElementById("desc-input"),
editselectstatus:document.getElementById("edit-select-status"),
selectstatus:document.getElementById("select-status"),
newtaskmodalwindow:document.getElementById("new-task-modal-window"),
edittaskform:document.getElementById("edit-task-form"),
sidelogodiv:document.getElementById("side-logo-div"),
layout:document.getElementById("layout"),
editBoardDiv:document.getElementById("editBoardDiv"),
todoheaddiv:document.getElementById("todo-head-div"),
doingheaddiv:document.getElementById("doing-head-div"),
filterDiv:document.getElementById("filterDiv")

}
let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard : boards[0];

    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; // Assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task)=> task.board === boardName);


  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);
    
    filteredTasks.filter((task) => task.status === status).forEach((task) => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      // Listen for a click event on each task and open a modal
taskElement.addEventListener("click", () => {
  openEditTaskModal(task);
});

tasksContainer.appendChild(taskElement);
});
});
}
function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach((btn)=> { 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active');
    }
    else {
      btn.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); 
}



function setupEventListeners() {
  const column = document.querySelector(
    '.column-div[data-status="${task.status}"]'
  );
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(
      `Tasks container not found for status: ${task.status}, creating one.`
    );
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);

  tasksContainer.appendChild();
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; // Fix: Corrected ternary operator syntax
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

  function addTask(event) {
    event.preventDefault();
  
    // Assign user input to the task object

  //Assign user input to the task object
    const task = {
      title: elements.titleinput.value,
      description:elements.descinput.value,
      status:elements.selectstatus.value,
      board: activeBoard, 
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}


function toggleSidebar(show) {
  if (show) {
    elements.sideBar.style.display = "flex"; // change display
    elements.showSideBarBtn.style.display = "none";
  } else {
    elements.sideBar.style.display = "none"; 
    elements.showSideBarBtn.style.display = "block";
  }
}
toggleSidebar(true);
function toggleTheme() {
  const body = document.body;

  // Toggle the body theme
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");

  // Check if the current theme is light or dark
  const isLight = body.classList.contains("light-theme");

  // Store the theme preference in local storage 
  if (isLight){
    localStorage.setItem("theme", "light" );
  } else{
    localStorage.setItem("theme",  "dark");
  }
  
}
function openEditTaskModal(task) {

  const titleInput = document.getElementById("edit-task-title-input");
  const descInput = document.getElementById("edit-task-desc-input");
  const statusSelect = document.getElementById("edit-select-status");

  // Get button elements from the task modal
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  // Call saveTaskChanges upon click of Save Changes button
  const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  saveTaskChangesBtn.addEventListener("click", () => {
    saveTaskChanges(task.id);
    refreshTasksUI();
    toggleModal(false, elements.editTaskModal);
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener("click", () => {
    deleteTask(task.id);

    refreshTasksUI();
    toggleModal(false, elements.editTaskModal);
  });
  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}


function saveTaskChanges(taskId) {
  // Get new user inputs
  const titleInput = document.getElementById("edit-task-title-input");
  const descInput = document.getElementById("edit-task-desc-input");
  const statusSelect = document.getElementById("edit-select-status");

  //create an object with the updated tast details 
  const updatedTask = {
    id: taskId,
    title: titleInput.value,
    description: descInput.value,
    status: statusSelect.value,
  };

  // Update task using an exported helper functoin
  patchTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  init(); 
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); 
}
