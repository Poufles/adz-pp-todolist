import CRUD from "../../scripts/crud.js";
import DashboardRuntime from "../../scripts/dashboard-runtime.js";
import DateHandler from "../../scripts/date-handler.js";
import SVG from '../../scripts/svg.js';
import CreateTodo from "../finestra/create-todo/create-todo.js";

function TodoBar(todoObject) {
    const template = `
    <article class="comp todo-bar select-none" tabindex="0" role="button">
        <div class="info-wrapper">
            <div class="check-container">
                <input type="checkbox" id="checkbox">
                <div tabindex="0" role="button" class="custom-checkbox">
                    <div id="hint-wrapper">
                        <div id="hint">
                            <p id="message">
                            &gt; Waiting...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mid-container">
                <div class="todo-container">
                    <p id="name">${todoObject.name}</p>
                </div>
                <button type="button" class="folder-container btn">
                    project: <span id="project">${todoObject.project}</span>
                </button>
            </div>
            <div class="time-container">
                <span class="" id="due-date">
                ${DateHandler.getTimeSlice(todoObject.deadline, 'hour')}
                </span>
                <span class="" id="due-message"></span>
            </div>
        </div>
    </article>
    `;

    let isEnabled = true;

    const componentActions = DashboardRuntime.componentActions;
    const checkIcon = SVG.i_check;
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('article.todo-bar');
    const input_checkbox = component.querySelector('input#checkbox');
    const checkbox = component.querySelector('.custom-checkbox');
    const checkbox_msg = checkbox.querySelector('#message');
    const cont_mid = component.querySelector('.mid-container');
    const p_name = cont_mid.querySelector('#name');
    const btn_project = cont_mid.querySelector('.folder-container');
    const btn_project_span = btn_project.querySelector('#project');
    const cont_time = component.querySelector('.time-container');
    const span_due = cont_time.querySelector('#due-date');
    const due_message = cont_time.querySelector('#due-message');

    if (btn_project_span) cont_mid.removeChild(btn_project);

    const timeDifference = DateHandler.timeDifference(todoObject.deadline);
    const isToday = timeDifference.isThisTimeToday;
    const milliseconds = timeDifference.millisecDifference;
    const days = timeDifference.daysDifference;
    const hours = timeDifference.hoursDifference;

    if (isToday) {
        due_message.classList.add('today');
        due_message.textContent = '> Due today!';
    } else if (days > 3) {
        cont_time.removeChild(due_message);
    } else if (days >= 3 || hours <= 24 && milliseconds > 0) {
        due_message.classList.add('soon');
        due_message.textContent = '> Due soon!';
    } else if (milliseconds < 0) {
        due_message.classList.add('overdue');
        due_message.textContent = 'Overdue...';
    };

    component.addEventListener('click', () => {
        console.log(todoObject);
        if (!isEnabled) return;

        disable();

        const mainInterfaceObj = componentActions.get('main-interface');

        const createTodo = CreateTodo(true);

        createTodo.editMode(todoObject, updateInfo);
        createTodo.modal(mainInterfaceObj.component);
        DashboardRuntime.objectActions.add('task-enable', enable)
    });

    component.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!isEnabled) return;

            disable();
        };
    });

    btn_project.addEventListener('click', () => {

    });

    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isEnabled) return;

        input_checkbox.checked = input_checkbox.checked ? false : true;
        todoObject.status = input_checkbox.checked;

        CRUD.updateTodoStatus(todoObject.id, todoObject.status);

        if (input_checkbox.checked) {
            checkbox_msg.textContent = '> Completed!';
            checkbox.prepend(checkIcon);
        } else {
            checkbox_msg.textContent = '> Waiting...';
            checkbox.removeChild(checkIcon);
        };
    });

    checkbox.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        checkbox.classList.add('hidden');
    });


    checkbox.addEventListener('mouseup', (e) => {
        e.stopPropagation();

        setTimeout(() => {
            checkbox.classList.remove('hidden');
        }, 100);
    });

    checkbox.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {

            if (!isEnabled) return;

            console.log('Checked');
        };
    });

    /**
     * Renders the component.
     * @param {HTMLElement} parent - The parent element to where the component must be appended 
     * @returns The component if no parent is added
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Automatically unrenders the component from its parent
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) parent.removeChild(component);
    };

    /**
     * Enables the component
     */
    const enable = () => {
        isEnabled = true;

        component.role = '';
        component.setAttribute('tabindex', '0');
        btn_project.disabled = 'false';
    };

    /**
     * Disables the component
     */
    const disable = () => {
        isEnabled = false;

        component.role = '';
        component.removeAttribute('tabindex');
        btn_project.disabled = 'true';
    };

    /**
     * Updates the todo information object of the component and its visuals 
     * @param {object} newInfo 
     */
    const updateInfo = (newInfo) => {
        enable();

        for (const key in newInfo) {
            if (todoObject.hasOwnProperty(key)) {
                todoObject[key] = newInfo[key];
            };
        };

        p_name.textContent = todoObject.name;        
        btn_project_span.textContent = todoObject.project;        
        span_due.textContent = DateHandler.getTimeSlice(todoObject.deadline, 'hour'); 
    };

    return {
        render,
        unrender,
        enable,
        disable,
        updateInfo
    }
};

function SortDeadlines() {

};

function DeadlineCheckerLoop() {

};

export default TodoBar;