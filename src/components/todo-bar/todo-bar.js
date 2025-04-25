import CRUD from "../../scripts/crud.js";
import DashboardRuntime from "../../scripts/dashboard-runtime.js";
import DateHandler from "../../scripts/date-handler.js";
import SVG from '../../scripts/svg.js';
import BoxButton from "../buttons/box-button/box-button.js";
import CreateTodo from "../finestra/create-todo/create-todo.js";
import TodoInterface from "../main-interface/todo-interface/todo-interface.js";
import { ConfirmMessageBox } from "../message-box/message-box.js";

function TodoBar(todoObject) {
    const template = `
    <div class="todo-shadow">
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
    </div>
    `;

    const template_overlay = `
        <div class="overlay"></div>
    `;

    const template_actions = `
        <div id="todo-bar-actions"></div>
    `;

    let isEnabled = true;
    let isViewed = false;
    let isBeingDeleted = false;

    const componentActions = DashboardRuntime.componentActions;
    const checkIcon = SVG.i_check;
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const fragmentOverlay = range.createContextualFragment(template_overlay);//
    const fragmentActions = range.createContextualFragment(template_actions);//
    const componentShadow = fragment.querySelector('.todo-shadow');//
    const overlay = fragmentOverlay.querySelector('div');
    const cont_actions = fragmentActions.querySelector('#todo-bar-actions');
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

    const deleteButton = BoxButton({
        text: 'delete',
        id: 'delete',
        isButtonOnly: true
    });

    const editButton = BoxButton({
        text: 'edit',
        id: 'edit',
        isButtonOnly: true
    });

    const btn_delete = deleteButton.component;
    const btn_edit = editButton.component;

    cont_actions.appendChild(btn_delete);
    cont_actions.appendChild(btn_edit);

    if (btn_project_span) cont_mid.removeChild(btn_project);

    UpdateDeadlineMessage(cont_time, todoObject.deadline);

    if (todoObject.status) {
        checkbox.prepend(checkIcon);
    };

    component.addEventListener('click', (e) => {
        if (isViewed) return;

        isViewed = true;

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const mainRect = main_interface.getBoundingClientRect();
        const mainComponentRec = component.getBoundingClientRect()
        const actualWidth = component.offsetWidth;
        const starting_style = `--starting-top: ${mainComponentRec.top - mainRect.top}px; --starting-left: ${mainComponentRec.left - mainRect.left}px; --actual-width: ${actualWidth}px`;

        main_interface.appendChild(overlay);
        overlay.classList.add('show');

        componentShadow.removeChild(component);
        overlay.appendChild(component);
        component.classList.add('view');
        component.setAttribute('style', starting_style);

        setTimeout(() => {
            const componentActualPos = component.getBoundingClientRect().bottom;

            const actionsPos = `--position: ${componentActualPos - 80}px`;

            overlay.appendChild(cont_actions);
            cont_actions.classList.add('show');
            cont_actions.setAttribute('style', actionsPos);
        }, 500);
    });


    component.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!isEnabled) return;

            disable();
        };
    });

    overlay.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isBeingDeleted) return;

        ExitAnimation(component, componentShadow, cont_actions, overlay);

        setTimeout(() => {
            isViewed = false;
        }, 200);
    });

    btn_project.addEventListener('click', () => {

    });

    btn_delete.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (isBeingDeleted) return;

        disable();

        isBeingDeleted = true;

        const messageBox = ConfirmMessageBox('Delete todo?', 'This todo will be sent to the archives.');

        const response = await messageBox.modal(overlay);

        if (response !== 'confirm') {
            enable();
            isBeingDeleted = false;

            return;
        };

        const status = CRUD.deleteTask(todoObject.id, 'todo');

        if (status === 'u-invalid') {
            return;
        };

        disable();
        TodoInterface.removeContent(todoObject.id);
    });

    btn_edit.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isEnabled) return;

        disable();

        if (isViewed) {
            ExitAnimation(component, componentShadow, cont_actions, overlay);

            setTimeout(() => {
                isViewed = false;
            }, 200);
        };

        const mainInterfaceObj = componentActions.get('main-interface');

        const createTodo = CreateTodo();

        createTodo.editMode(todoObject, updateInfo);
        createTodo.modal(mainInterfaceObj.component, 'todo', true);
        DashboardRuntime.objectActions.add('task-enable', enable);
        DashboardRuntime.objectActions.add('check-before-back', createTodo.checkValuesBeforeBack)
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
        };
    });

    /**
     * Renders the component.
     * @param {HTMLElement} parent - The parent element to where the component must be appended 
     * @returns The component if no parent is added
     */
    const render = (parent) => {
        // if (!parent) return component;
        if (!parent) return componentShadow;


        // parent.appendChild(component);
        parent.appendChild(componentShadow);
    };

    /**
     * Automatically unrenders the component from its parent
     * @param {string} animationType - none | exit | switch-enter
     */
    const unrender = (animationType = 'none') => {
        if (animationType === 'none') {
            const parent = componentShadow.parentElement;

            if (parent && parent.contains(componentShadow)) parent.removeChild(componentShadow);

            return;
        };

        if (animationType === 'exit') {
            ExitAnimation(component, componentShadow, cont_actions, overlay);

            setTimeout(() => {
                const parent = componentShadow.parentElement;

                if (parent && parent.contains(componentShadow)) parent.removeChild(componentShadow);
            }, 600);
        };
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
        UpdateDeadlineMessage(cont_time, todoObject.deadline);
    };

    return {
        information: todoObject,
        render,
        unrender,
        enable,
        disable,
        updateInfo
    }
};

function UpdateDeadlineMessage(timeContainer, deadline) {
    const due_message = timeContainer.querySelector('#due-message');

    const timeDifference = DateHandler.timeDifference(deadline);
    const isToday = timeDifference.isThisTimeToday;
    const isTomorrow = timeDifference.isThisTimeTomorrow;
    const milliseconds = timeDifference.millisecDifference;
    const days = timeDifference.daysDifference;
    const hours = timeDifference.hoursDifference;

    due_message.classList.remove('today');
    due_message.classList.remove('tomorrow');
    due_message.classList.remove('overdue');

    if (isToday) {
        due_message.classList.add('today');
        due_message.textContent = '> Due today!';
    } else if (isTomorrow) {
        due_message.classList.add('tomorrow');
        due_message.textContent = '> Due tomorrow!';
    } else if (days > 1) {
        due_message.textContent = '';
    } else if (milliseconds < 0) {
        due_message.classList.add('overdue');
        due_message.textContent = 'Overdue...';
    };
};

function SortDeadlines() {

};

function DeadlineCheckerLoop() {

};

function ExitAnimation(component, componentShadow, actionContainer, overlay) {
    const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
    const mainRect = main_interface.getBoundingClientRect();
    const mainComponentRect = component.getBoundingClientRect();
    const compShadowRect = componentShadow.getBoundingClientRect();
    const actualWidth = component.offsetWidth;
    const component_pos = `--parent-top: ${compShadowRect.top - mainRect.top}px; --parent-left: ${compShadowRect.left - mainRect.left}px`;
    const starting_style = `--starting-top: ${mainComponentRect.top - mainRect.top}px; --starting-left: ${mainComponentRect.left - mainRect.left}px`;

    component.classList.remove('view');
    component.classList.add('return');

    component.setAttribute('style', starting_style + '; ' + component_pos + '; --actual-width: ' + actualWidth + 'px');

    actionContainer.classList.remove('show');
    setTimeout(() => {
        if (overlay.contains(actionContainer)) overlay.removeChild(actionContainer);
        overlay.classList.remove('show');

        if (main_interface.contains(overlay)) main_interface.removeChild(overlay);
    }, 200);
    main_interface.appendChild(component);
    setTimeout(() => {
        component.classList.remove('return');

        if (!componentShadow.contains(component)) componentShadow.appendChild(component);
    }, 170);
};

export default TodoBar;