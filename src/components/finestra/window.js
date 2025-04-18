import WordButton from '../buttons/word-button/word-button.js';

/**
 * Creates a Window Component (Finestra in Italian)
 * @param {{
 *  isExpandable: boolean,
 *  id: string,
 *  windowTitle: string,
 *  titleButtonText: string
 * }} options - Properties to create
 * @returns {{
 *  component: HTMLElement,
 *  componentButtonsArr: Array,
 *  render: (parent: HTMLElement) => void,
 *  unrender: () => void,
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

    let componentObject, actionsObject;
    const componentButtonsArr = [];

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
        actionsObject = GetActionsComponent();

        const section_content = component.querySelector('section#content');

        section_content.appendChild(actionsObject.component);

        for (let button of actionsObject.buttonObjectsArr) {
            componentButtonsArr.push(button);
        };
    };

    const render = (parent) => {
        if (parent) {
            parent.appendChild(component); return;
        };

        return component;
    };

    const unrender = () => {
        parent = component.parentElement;

        if (parent && parent.contains(component)) {
            parent.removeChild(component); return;
        };
    };

    const enable = () => {
        for (let button of componentButtonsArr) {
            if (Object.hasOwn(button, 'enable')) {
                button.enable();
            } else {
                button.classList.remove('disabled');
            };
        };
    };
    
    const disable = () => {
        for (let button of componentButtonsArr) {
            if (Object.hasOwn(button, 'disable')) {
                button.disable();
            } else {
                button.classList.add('disabled');
            };
        };
    };

    return {
        component,
        componentButtonsArr,
        render,
        unrender,
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