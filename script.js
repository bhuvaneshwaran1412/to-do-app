const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
function saveTasks(){
    localStorage.setItem("tasks",taskList.innerHTML);
}
function updateCount(){
    const totalTasks = taskList.children.length;
    taskCount.textContent = totalTasks + "Tasks";
}
addBtn.addEventListener("click",function(){
    const taskText = taskInput.value.trim();
    if(taskText === ""){
        alert("Please Enter a Task");
        return;
    }
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type ="checkbox";
    const span = document.createElement("span");
    checkbox.addEventListener("change",function(){
        span.classList.toggle("completed");
    });
    span.textContent = taskText;
    span.addEventListener("click",function(){
        span.classList.toggle("completed");
    });
const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click",function(){
        li.remove();
        updateCount();
        saveTasks();
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    saveTasks();
    
    taskInput.value = "";
    updateCount();
});
window.onload = function(){
    taskList.innerHTML = localStorage.getItem("tasks") || "";

    // Re-attach events for restored tasks (checkbox + span toggle + delete)
    taskList.querySelectorAll("li").forEach(function(li){
        const checkbox = li.querySelector("input[type=\"checkbox\"]");
        const span = li.querySelector("span");
        const deleteBtn = li.querySelector("button");

        // sync checkbox initial state from saved HTML
        if(checkbox && span){
            checkbox.checked = span.classList.contains("completed");
        }

        if(checkbox){
            checkbox.addEventListener("change", function(){
                if(span){
                    span.classList.toggle("completed", checkbox.checked);
                }
                saveTasks();
            });
        }

        if(span){
            span.addEventListener("click", function(){
                span.classList.toggle("completed");
                if(checkbox) checkbox.checked = span.classList.contains("completed");
                saveTasks();
            });
        }

        if(deleteBtn){
            deleteBtn.addEventListener("click", function(){
                li.remove();
                updateCount();
                saveTasks();
            });
        }
    });

    updateCount();
    applyFilter('all');

    // hook filter buttons + clear completed
    document.querySelectorAll('.filter-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    const clearCompletedBtn = document.getElementById('clearCompleted');
    if(clearCompletedBtn){
        clearCompletedBtn.addEventListener('click', function(){
            taskList.querySelectorAll('li').forEach(function(li){
                const span = li.querySelector('span');
                if(span && span.classList.contains('completed')){
                    li.remove();
                }
            });
            saveTasks();
            updateCount();
            applyFilter('all');
        });
    }
};

function applyFilter(filter){
    const items = taskList.querySelectorAll('li');
    items.forEach(function(li){
        const span = li.querySelector('span');
        const isCompleted = !!(span && span.classList.contains('completed'));

        if(filter === 'completed'){
            li.style.display = isCompleted ? '' : 'none';
        }else if(filter === 'active'){
            li.style.display = !isCompleted ? '' : 'none';
        }else{
            li.style.display = '';
        }
    });
}
