import BoxButton from "../buttons/box-button/box-button.js";

function MainInterface({
    id,
    title,
    titleCount,
    description,
    buttonText,
    buttonId,
} = {}) {
    const template =
        `
    <article class="comp main-interface" id="interface-${id}">
        <div class="return-wrapper">
            <button type="button" class="btn select-none" id="return">&lt; go back</button>
        </div>
        <div class="top">
            <p class="title-wrapper">
                <span id="title">${title}</span>
            </p>
        </div>
        <p id="description">
            ${description}
        </p>
        <div id="content">
        </div>
    </article>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.main-interface');
    const cont_top = component.querySelector('.top');
    const cont_description = component.querySelector('#description');

    let cont_count;

    if (titleCount !== undefined) cont_count = CreateTitleCount(component, title, titleCount);

    const button = BoxButton({
        text: buttonText,
        id: buttonId
    });

    cont_top.appendChild(button.render());

    /**
     * Renders the component
     * @param {HTMLElement} parent - (Optional) The parent element to where the component must be appended
     * @returns The component if no parent is provided
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
     * Changes the count number in the title if it exists. Otherwise, creates a count title
     * @param {Number} newCount 
     */
    const changeTitleCount = (newCount) => {
        if (!cont_count) {
            cont_count = CreateTitleCount(component, title, newCount);
            return;
        };

        cont_count.textContent = ` | ${titleCount} ${title}`;
    };

    /**
     * Toggles return button
     * @param {boolean} toggle - Boolean value to toggle the return button above the component 
     */
    const toggleReturnButton = (toggle) => {
        const btn_return = component.querySelector('.return-wrapper #return');

        btn_return.disabled = toggle;
    };

    /**
     * Enables the component
     */
    const enable = () => {
        const allButtons = component.querySelectorAll('button');

        allButtons.forEach(button => {
            button.disabled = 'true';
        });
    };
    
    /**
     * Disables the component
     */
    const disable = () => {
        const allButtons = component.querySelectorAll('button');
    
        allButtons.forEach(button => {
            button.disabled = 'false';
        });
    };

    return {
        component,
        description: cont_description,
        render,
        unrender,
        changeTitleCount,
        toggleReturnButton,
        enable,
        disable
    };
};

/**
 * Creates a title count component
 * @param {HTMLElement} component 
 * @param {Number} container 
 */
function CreateTitleCount(component, type, count) {
    const template =
        `
        <span id="count"> | ${count} ${type}</span>
    `;

    const fragment = GetTemplateFragment(template);
    const countComponent = fragment.querySelector('#count');
    const title_wrapper = component.querySelector('.title-wrapper');

    title_wrapper.appendChild(countComponent);

    return countComponent
};

/**
 * Creates a component from the given string template
 * @param {string} template - Component Template 
 * @returns The fragment in HTML
 */
function GetTemplateFragment(template) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);

    return fragment
};

export default MainInterface