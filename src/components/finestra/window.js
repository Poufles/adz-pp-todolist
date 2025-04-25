import DashboardRuntime from '../../scripts/dashboard-runtime.js';
import WordButton from '../buttons/word-button/word-button.js';
import { ConfirmMessageBox } from '../message-box/message-box.js';

/**
 * Creates a Window Component (Finestra in Italian)
 * @param {{
 *  isExpanded: boolean,
 *  hasActions: boolean,
 *  id: string,
 *  windowTitle: string,
 *  titleButtonText: string,
 * }} options - Properties to create
 */
function Finestra({
    isExpanded = true,
    hasActions = false,
    id = 'id',
    windowTitle = 'Title',
    titleButtonText = 'close',
} = {}) {
    const template =
        `
        <div class="comp window-component expanded" id="window-name">
            <div class="title select-none cursor-default">
                <span class="text">${windowTitle}</span>
            </div>
            <section id="content">
                <div class="content-container">
                    
                </div>
            </section>
        </div>
    `;

    let isAnimating, visualComponent;
    let awaiting = false;
    let editMode;

    const templateFragment = GetTemplateFragment(template);
    const component = templateFragment.querySelector('.window-component');
    const titleButton = WordButton({
        text: titleButtonText,
        id: titleButtonText,
    });

    const cont_title = component.querySelector('.title');
    const btn_title = titleButton.render();

    cont_title.appendChild(btn_title);

    const componentButtonsArr = [];
    const contentItemsArr = [];

    const section_content = component.querySelector('section#content');
    const cont_content = section_content.querySelector('.content-container');

    if (!isExpanded) {
        const content_expansion = component.querySelector('section#content');

        if (content_expansion) {
            component.removeChild(content_expansion);
        };
    };

    const cont_titleBar = component.querySelector('.title');
    const span_title = cont_titleBar.querySelector('.text');

    componentButtonsArr.push(titleButton);

    component.id = `window-${id}`;

    if (hasActions) {
        const actionsObject = GetActionsComponent();

        const section_content = component.querySelector('section#content');

        section_content.appendChild(actionsObject.component);

        for (let button of actionsObject.buttonObjectsArr) {
            componentButtonsArr.push(button);
        };
    };
    
    component.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    /**
     * Renders the component if parent is provided
     * @param {HTMLElement} parent - (Optional) Parent to where the component must be appended
     * @returns The component if no parent is provided
     */
    const render = (parent) => {
        if (parent) {
            parent.appendChild(component); return;
        };

        return component;
    };

    /**
     * Automatically removes the component from its parent
     * @returns 
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent.id === 'overlay') {
            console.error('Error: component is used as a modal. Use unrenderModal() instead.');

            return;
        };

        if (parent && parent.contains(component)) {
            parent.removeChild(component); return;
        };
    };


    /**
     * Creates a render of the component in a modal.
     * @param {HTMLElement} parent - The parent component to where the overlay must be appended.
     * @param {string} type - Type of task to edit. ( todo || sticky || project )
     * @param {boolean} isEdit
     */
    const modal = (parent, type, isEdit = false) => {
        if (!parent) {
            console.error('Error: parent parameter does not exist');

            return;
        };

        let title;
        
        if (isEdit) {
            title = `Edit ${type}...`;
        } else {
            title = `Create ${type}...`;
        }
        
        enable();
        changeTitle(title);
        editMode = isEdit;

        const overlay = GetBackgroundOverlay();

        overlay.appendChild(component);
        parent.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('shown');
        }, 0);

        // CHANGE LATER IN CASE OF PROMISE
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();

            if (awaiting) return;

            unrenderModal();
        });
    };

    /**
     * Unrenders the modal.
     * @param {boolean} isCompleted - Accepts boolean value.
     * @returns 
     */
    const unrenderModal = async (isCompleted = false) => {
        disable();

        if (isCompleted) {
            CloseComponent(component, true);
            return;
        };

        let hasInputs = false
        for (let index = 0; index < contentItemsArr.length; index++) {
            const objectItem = contentItemsArr[index];

            if (!Object.hasOwn(objectItem, 'hasInputs')) continue;

            const input = objectItem.hasInputs();
            const inputComponent = objectItem.inputComponent;

            if (input.status && inputComponent.type !== 'button') {
                hasInputs = true; break;
            };
        };

        if (!hasInputs) {
            CloseComponent(component, true);

            return;
        };

        let title;

        if (editMode) {
            title = 'Cancel edit?';
        } else {
            title = 'Cancel creation?'
        };

        const messageBox = ConfirmMessageBox(title, 'Are you sure you want to cancel?');

        const response = await messageBox.modal(overlay);

        if (response !== 'confirm') {
            enable();

            return;
        };

        if (response === 'confirm') {
            CloseComponent(component, true);
        };
    };

    /**
     * Adds new content in the component
     * @param {Object} object - Object to append automatically inside the component. 
     */
    const addContent = (object) => {
        if (Object.hasOwn(object, 'render')) {
            object.render(cont_content);
            contentItemsArr.push(object);
        } else {
            cont_content.appendChild(object);
            contentItemsArr.push(object);
            console.log(`Object element has no render()`);
        };
    };

    /**
     * Adds a status and keyboard hints 
     * @param {string} statusMessage - Message to show in the status 
     * @param  {...any} keyboardHints 
     */
    const addKeyboardAndStatusTip = (statusMessage, ...keyboardHints) => {
        const keyboardNStats = GetKeyboardNStatus(statusMessage, keyboardHints);

        cont_content.appendChild(keyboardNStats);
    };

    /**
     * Adds a bottom message in the component (Use this lastly)
     * @param {string} message 
     */
    const addBottomMessage = (message) => {
        const bottomMessage = GetBottomMessage(message);

        cont_content.appendChild(bottomMessage);
    };

    /**
     * Adds a visual object when empty
     * @param {HTMLElement | string} svgHTML - HTML element or string to add as a visual aid
     * @param {string} message - Message to show 
     * @returns An object containing 3 properties to access or change its elements (component | svgContainer | messageContainer)
     */
    const addEmptyVisual = (svgHTML, message) => {
        if (visualComponent) visualComponent = undefined;

        const visualObject = GetEmptyVisual(svgHTML, message);
        visualComponent = visualObject.component;

        cont_content.appendChild(visualComponent);

        return visualObject;
    };

    /**
     * Verifies if contents containing inputs all have values.
     * @returns Boolean value
     */
    const inputsHasValue = () => {
        let hasValue = true;

        for (let index = 0; index < contentItemsArr.length; index++) {
            const objectItem = contentItemsArr[index];

            if (Object.hasOwn(objectItem, 'hasInputs')) {
                const inputObject = objectItem.hasInputs();

                if (!inputObject.status && !inputObject.isOptional) {
                    hasValue = false;
                    objectItem.requiredMessage();
                };
            };
        };

        return hasValue;
    };

    /**
     * Reset all inputs if inputs exist.
     */
    const resetInputs = () => {
        const itemsLength = contentItemsArr.length;

        if (itemsLength != 0) {
            contentItemsArr.forEach(item => {
                if (Object.hasOwn(item, 'removeInput')) {
                    item.removeInput();
                };
            });
        };
    };

    /**
     * Toggles visual
     * @param {boolean} toggle - Accepts a boolean value to toggle visual for empty windows if it exists. 
     */
    const toggleVisual = (toggle) => {
        if (visualComponent && cont_content.contains(visualComponent) && toggle) {
            cont_content.removeChild(visualComponent);
        };


        if (visualComponent && cont_content.contains(visualComponent) && !toggle) {
            cont_content.appendChild(visualComponent);
        };
    };

    /**
     * Changes the title of the window
     * @param {string} newTitle - The new title 
     */
    const changeTitle = (newTitle) => {
        if (typeof newTitle === 'string') {
            span_title.textContent = newTitle;
        };
    };

    /**
     * Enables the component for interactivity
     */
    const enable = () => {
        awaiting = false;

        const allButtons = component.querySelectorAll('button');
        const allInputs = component.querySelectorAll('input');
        const allTextareas = component.querySelectorAll('textarea');

        if (allButtons.length != 0) {
            allButtons.forEach(button => {
                button.disabled = false;
            });
        };

        if (allInputs.length != 0) {
            allInputs.forEach(input => {
                input.disabled = false;
            });
        };

        if (allTextareas.length != 0) {
            allTextareas.forEach(textarea => {
                textarea.disabled = false;
            });
        };
    };

    /**
     * Disables the component
     */
    const disable = () => {
        awaiting = true;

        const allButtons = component.querySelectorAll('button');
        const allInputs = component.querySelectorAll('input');
        const allTextareas = component.querySelectorAll('textarea');

        if (allButtons.length != 0) {
            allButtons.forEach(button => {
                button.disabled = true;
            });
        };

        if (allInputs.length != 0) {
            allInputs.forEach(input => {
                input.disabled = true;
            });
        };

        if (allTextareas.length != 0) {
            allTextareas.forEach(textarea => {
                textarea.disabled = true;
            });
        };
    };

    /**
     * Animates the component
     * @param {string} type - enter || leave 
     */
    const animate = (type) => { // ANIMATION FOR THIS COMPONENT IS FOUND IN THE dashboard.css ITSELF
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

    return {
        component,
        closeButton: btn_title,
        componentButtonsArr,
        contentItemsArr,
        render,
        unrender,
        modal,
        unrenderModal,
        addContent,
        inputsHasValue,
        resetInputs,
        addKeyboardAndStatusTip,
        addBottomMessage,
        addEmptyVisual,
        toggleVisual,
        changeTitle,
        enable,
        disable,
        animate
    };
};

/**
 * Retrieves actions component
 * @returns {{
 *  component: HTMLElement,
 *  buttonObjectsArr: Array
 * }}
 */
function GetActionsComponent() {
    const template =
        `
        <div class="actions">
        </div>
    `;

    const templateFragment = GetTemplateFragment(template);
    const component = templateFragment.querySelector('.actions');
    const resetButton = WordButton({
        text: 'reset',
        id: 'reset',
        isAlt: true
    });
    const saveButton = WordButton({
        text: 'save',
        id: 'confirm',
    });
    const buttonObjectsArr = [resetButton, saveButton];

    const btn_reset = resetButton.render();
    const btn_save = saveButton.render();

    component.appendChild(btn_reset);
    component.appendChild(btn_save);

    return {
        component,
        buttonObjectsArr
    };
};

/**
 * Retrieves the keyboard and status component
 * @param {string} statusName - Name to be added in the status part of the component 
 * @param {Array} keyboardHints - Array containing the keyboard input hints
 */
function GetKeyboardNStatus(statusName, keyboardHints) {
    const keyHintfragments = [];

    if (keyboardHints.length !== 0) {
        for (let index = 0; index < keyboardHints.length; index++) {
            const template_keyHint =
                `
                <span class="tip" id="tip-${index}">- ${keyboardHints[index]}</span>
            `;

            const keyHintfragment = GetTemplateFragment(template_keyHint);
            const component = keyHintfragment.querySelector('span.tip');

            keyHintfragments.push(component);
        };
    };

    const template =
        `
        <div id="keys-status">
            <p class="select-none cursor-default" id="status-msg">
                Status: <span id="status">${statusName}</span>...
            </p>
            <p class="select-none cursor-default" id="tip-msg">
            </p>
        </div>
    `;

    const fragment = GetTemplateFragment(template);
    const component = fragment.querySelector('#keys-status');
    const tip_msg = component.querySelector('#tip-msg');

    for (let index = 0; index < keyHintfragments.length; index++) {
        tip_msg.appendChild(keyHintfragments[index]);
    };

    return component;
};

/**
 * Retrieves an empty visual object
 * @param {HTMLElement | string} svg - SVG to append for visual aids 
 * @param {string} message - Message to add context 
 * @returns {{
 * component: HTMLElement,
 * svgContainer: HTMLElement,
 * messageContainer: HTMLElement
 * }}
 */
function GetEmptyVisual(svg, message) {
    const template =
        `
        <div class="select-none" id="empty-visual">
            <div id="visual">
            </div>
            <p id="message">
                ${message}
            </p>
        </div>
    `;

    const fragment = GetTemplateFragment(template);
    const component = fragment.querySelector('#empty-visual');

    let svgElement = svg;

    if (typeof svg === String) {
        const svgFragment = GetTemplateFragment(svg);
        svgElement = svgFragment.querySelector('svg');
    };

    const visual_element = component.querySelector('#visual');
    visual_element.appendChild(svgElement);

    const messageContainer = component.querySelector('#message');

    return {
        component,
        svgContainer: visual_element,
        messageContainer: messageContainer
    };
};

/**
 * Creates a bottom message component
 * @param {string} message - Text message 
 * @returns 
 */
function GetBottomMessage(message) {
    const template =
        `
        <p class="select-none cursor-default" id="bottom-msg">${message}</p>
    `;

    const fragment = GetTemplateFragment(template);
    const component = fragment.querySelector('#bottom-msg');

    return component;
};

function GetBackgroundOverlay() {
    const template = `
        <div class="modal" id="overlay"></div>
    `

    const fragment = GetTemplateFragment(template);
    const component = fragment.querySelector('#overlay');

    return component;
};

/**
 * Closes the component
 * @param {HTMLElement} component 
 * @param {HTMLElement} closeButton 
 * @param {boolean} isModal 
 */
function CloseComponent(component, isModal) {
    const task_enable = DashboardRuntime.objectActions.get('task-enable');

    if (task_enable) {
        task_enable();
    };

    if (isModal) {
        const overlay = component.parentElement;
        const parent = overlay.parentElement

        if (parent) {
            overlay.classList.remove('shown');
            setTimeout(() => {
                if (parent.contains(overlay)) parent.removeChild(overlay);
            }, 200);
        };

        return;
    };

    const parent = component.parentElement;

    if (parent && parent.contains(component)) {
        parent.removeChild(component);
    };
};

/**
 * Creates a component from the given string template
 * @param {string} template - Component Template 
 * @returns The component in HTML
 */
function GetTemplateFragment(template) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);

    return fragment
};

export default Finestra;