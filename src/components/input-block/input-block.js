function InputBlock({
    inputType = 'one',
    title = 'Input title',
    inputId = 'item',
    isOptional = false,
    hint = {
        hasHint: false,
        title: 'hint title',
        message: "i'm a hint",
        clickable: false,
    }
} = {}) {
    const template =
        `
        <article class="comp input-block ${inputType}-liner">
            <label for="item" class="input-label select-none cursor-default">
                <span class="title">${title}: </span> 
            </label>
            <div class="input-wrapper">
                <span class="arrow">&gt;</span>
            </div>
        </article>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('article.input-block');

    let optionalComponent;

    if (isOptional) {
        const input_label = component.querySelector('.input-label');

        optionalComponent = CreateOptional();
        input_label.appendChild(optionalComponent);
    };

    let objectComponents

    if (inputType.toLowerCase() === 'one') {
        objectComponents = CreateOneLiner(component, inputId);
    } else if (inputType.toLowerCase() === 'multi') {
        objectComponents = CreateMultiLiner(component, inputId);
    } else if (inputType.toLowerCase() === 'time') {

    } else {
        console.log(`Type argument (${inputType}) is not a proper type.`);

        return false;
    };

    let hintComponent;

    if (hint.hasHint) {
        hintComponent = CreateHint(hint.title, hint.message, hint.clickable);

        component.appendChild(hintComponent);
    };

    if (objectComponents.input) {
        const arrow = component.querySelector('.input-wrapper .arrow');
        const input = objectComponents.input;

        input.addEventListener('keydown', (e) => {
            if (arrow.classList.contains('stagnant')) arrow.classList.remove('stagnant');

            arrow.classList.add('typing');
        });

        input.addEventListener('keyup', (e) => {
            arrow.classList.remove('typing');
        });

        input.addEventListener('blur', (e) => {
            if (input.value) {
                arrow.classList.add('stagnant');
            } else {
                arrow.classList.remove('stagnant');
            }
        });
    };

    /**
     * Renders the component
     * @param {HTMLElement} parent - (Optional) Parent element to where the component must be appended  
     * @returns The component itself if not argument is passed
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Unrenders the component automatically from its parent
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) {
            parent.removeChild(component);
        };
    };

    /**
     * Enables all inputtable and clickable elements
     */
    const enable = () => {
        const inputElements = component.querySelector('input');
        const textareaElements = component.querySelector('textarea');
    };

    /**
     * Disables all inputtable and clickable elements
     */
    const disable = () => {

    };

    /**
     * Shows hint if it exists
     */
    const showHint = () => {
        if (hint.hasHint && hintComponent) {
            hintComponent.classList.remove('hidden');
        };
    };

    /**
     * Hides hint if it exists
     */
    const hideHint = () => {
        if (hint.hasHint && hintComponent) {
            hintComponent.classList.add('hidden');
        };
    };

    /**
     * Adds clickables in the hint.
     * @param {{
     *  refresh: boolean,
     * }} option
     * @param  {...HTMLButtonElement} clickables
     */
    const addClickables = ({ refresh = false } = {}, ...clickables) => {
        if (refresh && hint.hasHint && hint.clickable && hintComponent) {
            const button_group = hintComponent.querySelector('.button-group');

            button_group.innerHTML = '';
        };

        if (hint.hasHint && hint.clickable && hintComponent) {
            const button_group = hintComponent.querySelector('.button-group');

            clickables.forEach(clickable => {
                button_group.appendChild(clickable);
            });
        };
    };

    return {
        component,
        render,
        unrender,
        enable,
        disable,
        showHint,
        hideHint,
        addClickables
    };
};

/**
 * Creates a one liner input block component
 * @param {HTMLElement} component - Component to handle 
 * @param {string} inputId - Component's id
 * @returns {{
 *  input: HTMLInputElement
 * }}
 */
function CreateOneLiner(component, inputId) {
    const template =
        `
        <input type="text" id="${inputId}">
    `;

    const fragment = CreateFragment(template);
    const input = fragment.querySelector('input');

    const cont_inputWrapper = component.querySelector('.input-wrapper');

    cont_inputWrapper.appendChild(input);

    return {
        input
    };
};

/**
 * Creates a multi liner input block component
 * @param {HTMLElement} component - Component to handle 
 * @param {string} inputId - Component's id
 * @returns {{
*  input: HTMLInputElement
* }}
*/
function CreateMultiLiner(component, inputId) {
    const template =
        `
        <textarea name="" id="${inputId}" rows="1"></textarea>
    `;

    const fragment = CreateFragment(template);
    const input = fragment.querySelector('textarea');

    const cont_inputWrapper = component.querySelector('.input-wrapper');

    cont_inputWrapper.appendChild(input);

    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
    });

    return {
        input
    }
};

function CreateTimeLiner() {

};

/**
 * Creates an optional component
 * @returns Returns optional component
 */
function CreateOptional() {
    const template =
        `
        <span class="optional">(optional)</span>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('span');

    return component;
};

/**
 * 
 * @param {HTMLElement} component 
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} clickable 
 */
function CreateHint(title, message, clickable) {
    const template =
        `
        <div class="hint cursor-default select-none">
            <span class="title">${title}: </span>
        </div>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('.hint');

    if (clickable) {
        const clickableTemplate =
            `
            <div class="button-group"></div>
        `;

        const fragment = CreateFragment(clickableTemplate);
        const container = fragment.querySelector('div');

        component.appendChild(container);
    } else {
        const messageTemplate =
            `
        <span class="text">${message}</span>
        `;

        const fragment = CreateFragment(messageTemplate);
        const container = fragment.querySelector('span');

        component.appendChild(container);
    };

    return component;
};

/**
 * Creates a contextual fragment
 * @param {string} template - HTML template to make a fragment
 * @returns A contextual fragment of the template (HTMLElement) 
 */
function CreateFragment(template) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);

    return fragment;
}

export default InputBlock;