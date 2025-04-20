import WordButton from '../buttons/word-button/word-button.js';

/**
 * Creates a Window Component (Finestra in Italian)
 * @param {{
 *  isExpandable: boolean,
 *  id: string,
 *  windowTitle: string,
 *  titleButtonText: string,
 *  keyboardNStatus: {
 *      hasKeyboardInputs: boolean,
 *      statusName: string,
 *      keyboardHints: Array
 *  }
 * }} options - Properties to create
 * @returns {{
 *  component: HTMLElement,
 *  componentButtonsArr: Array,
 *  render: (parent: HTMLElement) => void,
 *  unrender: () => void,
 *  addKeyboardAndStatusTip: (statusMessage: string, ...keyboardHints: Array) => void,
 *  addBottomMessage: (message: string) => void
 *  addContent: (parent: HTMLElement) => void,
 *  enable: () => void,
 *  disable: () => void
 * }}
 */
function Finestra({
    isExpandable = false,
    hasActions = false,
    id = 'id',
    windowTitle = 'Title',
    titleButtonText = 'close',
} = {}) {

    let componentObject;
    const componentButtonsArr = [];
    const contentItemsArr = [];

    if (!isExpandable) {
        componentObject = GetUnexpandableComponent(titleButtonText);
    } else {
        componentObject = GetExpandableComponent(titleButtonText);
    };

    const component = componentObject.component;

    const cont_titleBar = component.querySelector('.title');
    const span_title = cont_titleBar.querySelector('.text');

    if (componentObject.buttonObjectsArr) {
        for (let button of componentObject.buttonObjectsArr) {
            componentButtonsArr.push(button);
        };
    };

    component.id = `window-${id}`;
    span_title.textContent = windowTitle;

    if (hasActions) {
        const actionsObject = GetActionsComponent();

        const section_content = component.querySelector('section#content');

        section_content.appendChild(actionsObject.component);

        for (let button of actionsObject.buttonObjectsArr) {
            componentButtonsArr.push(button);
        };
    };

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

        if (parent && parent.contains(component)) {
            parent.removeChild(component); return;
        };
    };

    /**
     * Adds new content in the component
     * @param {Object} object - Object to append automatically inside the component. 
     */
    const addContent = (object) => {
        if (Object.hasOwn(object, 'render')) {
            const section_content = component.querySelector('section#content');
            const cont_content = section_content.querySelector('.content-container');

            object.render(cont_content);
            contentItemsArr.push(object);
        } else {
            console.log(`Object element has no render()`);
        };
    };

    // const removeContent = (element) => {
    //     if (Object.hasOwn(element, 'unrender')) {
    //         element.unrender();
    //         contentItemsArr.splice(element);
    //     } else {
    //         console.log(`Object element has no render()`);
    //     };
    // };

    /**
     * Adds a status and keyboard hints 
     * @param {string} statusMessage - Message to show in the status 
     * @param  {...any} keyboardHints 
     */
    const addKeyboardAndStatusTip = (statusMessage, ...keyboardHints) => {
        const keyboardNStats = GetKeyboardNStatus(statusMessage, keyboardHints);
        const section_content = component.querySelector('section#content');
        const cont_content = section_content.querySelector('.content-container');
    
        cont_content.appendChild(keyboardNStats);
    };

    /**
     * Adds a bottom message in the component (Use this lastly)
     * @param {string} message 
     */
    const addBottomMessage = (message) => {
        const bottomMessage = GetBottomMessage(message);
        
        const section_content = component.querySelector('section#content');
        const cont_content = section_content.querySelector('.content-container');

        cont_content.appendChild(bottomMessage);
    };

    /**
     * Enables the component for interactivity
     */
    const enable = () => {
        const allButtons = component.querySelectorAll('button');
        const allInputs = component.querySelectorAll('input');
        const allTextareas = component.querySelectorAll('textarea');

        if (allButtons.length != 0) {
            allButtons.forEach(button => {
                button.disabled = 'true';
            });
        };

        if (allInputs.length != 0) {
            allInputs.forEach(input => {
                input.disabled = 'true';
            });
        };

        if (allTextareas.length != 0) {
            allTextareas.forEach(textarea => {
                textarea.disabled = 'true';
            });
        };
    };
    
    /**
     * Disables the component
     */
    const disable = () => {
        const allButtons = component.querySelectorAll('button');
        const allInputs = component.querySelectorAll('input');
        const allTextareas = component.querySelectorAll('textarea');

        if (allButtons.length != 0) {
            allButtons.forEach(button => {
                button.disabled = 'false';
            });
        };

        if (allInputs.length != 0) {
            allInputs.forEach(input => {
                input.disabled = 'false';
            });
        };

        if (allTextareas.length != 0) {
            allTextareas.forEach(textarea => {
                textarea.disabled = 'false';
            });
        };
    };

    return {
        component,
        componentButtonsArr,
        render,
        unrender,
        addContent,
        addKeyboardAndStatusTip,
        addBottomMessage,
        enable,
        disable
    };
};

/**
 * Retrieves unexpandable component object
 * @param {*} titleButtonText - Title text for the title button 
 * @returns {{
 *  component: HTMLElement,
 *  buttonObjectsArr: Array
 * }}
 */
function GetUnexpandableComponent(titleButtonText = 'see all') {
    const template =
        `
        <div class="comp window-component unexpandable" id="window-name">
            <div class="title select-none cursor-default">
                <span class="text">Item Title</span>
            </div>
            <section id="content">
                <div class="content-container">
                    
                </div>
            </section>
        </div>
    `;

    const templateFragment = GetTemplateFragment(template);
    const component = templateFragment.querySelector('.comp');
    const titleButton = WordButton({
        text: titleButtonText,
        id: titleButtonText,
    });
    const buttonObjectsArr = [titleButton];

    const cont_title = component.querySelector('.title');
    const btn_title = titleButton.render();

    cont_title.appendChild(btn_title);

    return {
        component,
        buttonObjectsArr
    };
};

/**
 * Retrieves expandable component object
 * @param {string} titleButtonText - Title text for the title button 
 * @returns {{
 *  component: HTMLElement
 * }}
 */
function GetExpandableComponent(titleButtonText = 'close') {
    const template =
        `
        <div class="comp window-component expandable" id="window-name">
            <button type="button" class="btn title">
                <span class="text">${titleButtonText}</span><span class="action-text">close</span><span
                    class="action-icon">&gt;</span>
            </button>
            <section id="content">
                <div class="content-container">
                    
                </div>
            </section>
        </div>
    `;

    const templateFragment = GetTemplateFragment(template);
    const component = templateFragment.querySelector('.comp');

    const cont_title = component.querySelector('.title');

    if (cont_title) {
        cont_title.addEventListener('click', () => {
            if (cont_title.classList.contains('disabled')) return;

            const span_title_text = cont_title.querySelector('.action-text');
            const span_title_icon = cont_title.querySelector('.action-icon');
            const section_content = component.querySelector('#content');

            if (span_title_text) {
                span_title_text.classList.toggle('show');
            };

            if (span_title_icon) {
                span_title_icon.classList.toggle('hide');
            };

            if (section_content) {
                section_content.classList.toggle('show');
            };
        });
    };

    const buttonObjectsArr = [ cont_title ];

    return { 
        component,
        buttonObjectsArr 
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
        id: 'save',
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


function GetBottomMessage(message) {
    const template =
    `
        <p class="select-none cursor-default" id="bottom-msg">${message}</p>
    `;

    const fragment = GetTemplateFragment(template);
    const component = fragment.querySelector('#bottom-msg');

    return component;
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