document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // App State
    let tasks = [];
    let currentFilter = 'all';
    
    // Load tasks from localStorage
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    };
    
    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    // Generate unique ID for tasks
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    
    // Add new task
    const addTask = (text) => {
        if (text.trim() === '') return;
        
        const newTask = {
            id: generateId(),
            text: text,
            completed: false,
            createdAt: new Date()
        };
        
        tasks.unshift(newTask); // Add to beginning of array
        saveTasks();
        renderTasks();
        taskInput.value = '';
    };
    
    // Delete task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };
    
    // Toggle task completion status
    const toggleTaskStatus = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    };
    
    // Clear completed tasks
    const clearCompleted = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };
    
    // Filter tasks based on current filter
    const getFilteredTasks = () => {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    };
    
    // Update tasks counter
    const updateTasksCounter = () => {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    };
    
    // Create task element
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        
        return li;
    };
    
    // Render tasks to DOM
    const renderTasks = () => {
        const filteredTasks = getFilteredTasks();
        taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        updateTasksCounter();
    };
    
    // Set active filter
    const setFilter = (filter) => {
        currentFilter = filter;
        
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderTasks();
    };
    
    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
    });
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Initialize app
    loadTasks();
});