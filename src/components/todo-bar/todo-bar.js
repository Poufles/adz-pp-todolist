function TodoBar() {
    const template = `
    <article class="comp todo-bar select-none" tabindex="0" role="button">
        <div class="info-wrapper">
            <div class="check-container">
                <input type="checkbox" id="checkox">
                <div class="custom-checkbox">
    
                </div>
            </div>
            <div class="mid-container">
                <div class="todo-container">
                    <p id="name">make a coffee</p>
                </div>
                <div class="folder-container">
                    in project <span id="project">cool project</span>
                </div>
            </div>
            <div class="time-container">
                06:40pm
            </div>
        </div>
    </article>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('article.todo-bar');

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

    return {
        render,
        unrender
    }
};

export default TodoBar;