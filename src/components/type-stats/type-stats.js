import StorageHandler from "../../scripts/storage-handler.js";

const TypeStats = function() {
    const account = StorageHandler.GetStorage(true);

    const template = 
    `
    <div class="comp type-stats select-none">
        <p id="stickies">
            stickies | <span class="count">${account.sticky.length}</span>
        </p>
        <p id="todos">
            todos | <span class="count">${account.todo.length}</span>
        </p>
        <p id="projects">
            projects | <span class="count">${account.project.length}</span>
        </p>
    </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.type-stats');
    const count_stickies = component.querySelector('#stickies .count');
    const count_todos = component.querySelector('#todos .count');
    const count_projects = component.querySelector('#projects .count');

    /**
     * Renders the component.
     * @param {HTMLElement} parent - (Optional) The parent element to where the component must be appended.
     * @returns The component if parent is not put.
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Automatically remove the component from its parent
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) {
            parent.removeChild(component);
        };
    };

    /**
     * Updates the values of the component
     * @param {string} type - todo | sticky | project
     * @param {string} newValue - The new value to update
     */
    const updateType = (type, newValue) => {
        if (type === 'todo') {
            count_todos.textContent = newValue;
        } else if (type === 'sticky') {
            count_stickies.textContent = newValue;
        } else if (type === 'project') {
            count_projects.textContent = newValue;
        } else {
          console.log(`Error: Provided type (${type}) is not one ofthe formats.`);  
        }
    };

    return {
        component,
        render,
        unrender,
        updateType
    };
}();

export default TypeStats;