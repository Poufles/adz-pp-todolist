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
        <div class="top select-none">
            <p class="title-wrapper">
                <span id="title">${title}</span>
            </p>
        </div>
        <p class="select-none" id="description">
            ${description}
        </p>
        <div class="select-none" id="content">
        </div>
    </article>
    `;

    let isAnimating = false;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.main-interface');
    const btn_return = component.querySelector('button#return');
    const cont_top = component.querySelector('.top');
    const cont_description = component.querySelector('#description');
    const cont_content = component.querySelector('#content');

    const contentArr = [];
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

        if (!parent.contains(component)) parent.appendChild(component);
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

        btn_return.disabled = !toggle;
    };

    /**
     * Enables the component
     */
    const enable = () => {
        const allButtons = component.querySelectorAll('button');

        allButtons.forEach(button => {
            console.log(button);
            button.disabled = false;
        });
    };

    /**
     * Disables the component
     */
    const disable = () => {
        const allButtons = component.querySelectorAll('button');

        allButtons.forEach(button => {
            button.disabled = true;
        });
    };

    /**
     * Animates the component.
     * @param {string} type - enter || leave
     * @returns 
     */
    const animate = (type) => {
        if (!component.parentElement) return;
        if (isAnimating) return;

        isAnimating = true;
        disable();

        if (type === 'leave')
            component.classList.add('animate-leave');

        if (type === 'enter') {
            component.classList.add('entering');
            setTimeout(() => {
                component.classList.add('animate-enter');
            }, 0);
        };

        setTimeout(() => {
            isAnimating = false;
            component.classList.remove('animate-leave');
            component.classList.remove('entering');
            component.classList.remove('animate-enter');
            enable();
        }, 530);
    };

    const getContentArray = () => contentArr;

    /**
     * Adds new content.
     * @param {object} object 
     */
    const addContent = (object) => {
        if (Object.hasOwn(object, 'render')) {
            contentArr.push(object);
            object.render(cont_content);
        } else {
            console.error('Error: The given object does not have a render() function.');
        }
    };

    return {
        component,
        createButton: button.component,
        returnButton: btn_return,
        description: cont_description,
        render,
        unrender,
        changeTitleCount,
        toggleReturnButton,
        enable,
        disable,
        animate,
        getContentArray,
        addContent
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