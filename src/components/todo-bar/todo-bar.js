import DateHandler from "../../scripts/date-handler.js";

function TodoBar(todoObject) {
    const template = `
    <article class="comp todo-bar select-none" tabindex="0" role="button">
        <div class="info-wrapper">
            <div class="check-container">
                <input type="checkbox" id="checkox">
                <div tabindex="0" role="button" class="custom-checkbox">
    
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

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('article.todo-bar');
    const checkbox = component.querySelector('.custom-checkbox');
    const cont_mid = component.querySelector('.mid-container');
    const btn_project = cont_mid.querySelector('.folder-container');
    const btn_project_span = btn_project.querySelector('#project');
    const cont_time = component.querySelector('.time-container');
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
        if (!isEnabled) return;
        
        console.log('Hello');
        disable();
    });

    component.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!isEnabled) return;
            
            console.log('Hello');
            disable();
        };
    });

    btn_project.addEventListener('click', () => {

    });

    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isEnabled) return;

        console.log('Checked');
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

    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) parent.removeChild(component);
    };

    const enable = () => {
        isEnabled = false;
    
        component.role = '';
        component.removeAttribute('tabindex');
        btn_project.disabled = 'false';
    };

    const disable = () => {
        isEnabled = false;

        component.role = '';
        component.removeAttribute('tabindex');
        btn_project.disabled = 'true';
    };

    return {
        render,
        unrender,
        enable,
        disable
    }
};

function SortDeadlines() {

};

function DeadlineCheckerLoop() {

};

export default TodoBar;