let tasks = [];

function updateTime() {
	chrome.storage.local.get(["timer", "timeOption"], (res) => {
		const time = document.getElementById("time");
		const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
		let seconds = "00";
		if (res.timer % 60 != 0) {
			seconds = `${60 - res.timer % 60}`.padStart(2, "0");
		}
		console.log(res);
		time.textContent = (res.timer == 0 && res.timeOption == 60) ? '1:00:00' : `${minutes}:${seconds}`;
	});
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
	chrome.storage.local.get(["isRunning"], (res) => {
		chrome.storage.local.set({
			isRunning: !res.isRunning,
		}, () => {
			startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
		});
	});
});

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
	chrome.storage.local.set({
		timer: 0,
		isRunning: false
	}, () => {
		startTimerBtn.textContent = "Start Timer";
	});
});

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => {
	addTask();
});

chrome.storage.sync.get(["tasks"], (res) => {
	tasks = res.tasks ? res.tasks : [];
	renderAllTasks();
});

function saveTasks() {
	chrome.storage.sync.set({
		tasks,
	});
}

function renderTask(taskNum) {
	const taskRow = document.createElement("div");

	const text = document.createElement("input");
	text.type = "text";
	text.placeholder = "Enter a task...";
	text.value = tasks[taskNum];
	text.className = "task-input";
	text.addEventListener("change", () => {
		tasks[taskNum] = text.value;
		saveTasks();
	});

	const deleteBtn = document.createElement("input");
	deleteBtn.type = "button";
	deleteBtn.value = "X";
	deleteBtn.className = "task-delete";
	deleteBtn.addEventListener("click", () => {
		deleteTask(taskNum);
	});

	taskRow.appendChild(text);
	taskRow.appendChild(deleteBtn);

	const taskContainer = document.getElementById("task-container");
	taskContainer.appendChild(taskRow);
}

function addTask() {
	const taskNum = tasks.length;
	tasks.push("");
	renderTask(taskNum)
	saveTasks();
}

function deleteTask(taskNum) {
	tasks.splice(taskNum, 1);
	renderAllTasks();
	saveTasks();
}

function renderAllTasks() {
	const taskContainer = document.getElementById("task-container");
	taskContainer.textContent = "";
	tasks.forEach((taskText, taskNum) => {
		renderTask(taskNum);
	});
}