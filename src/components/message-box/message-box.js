import WordButton from '../buttons/word-button/word-button.js';

/**
 * Creates a base message box
 * @returns MessageBox object
 */
function MessageBox({ title, text, htmlTemplate, onCreate }) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(htmlTemplate);
    const component = fragment.firstElementChild;
    const cont_titlebar = component.querySelector('#title-bar');
    const p_title = component.querySelector('#title');
    const p_text = component.querySelector('#text');

    p_title.textContent = title;
    p_text.textContent = text;

    if (onCreate) onCreate(component);

    const cont_titlebar_action = cont_titlebar.querySelector('#actions')
    const closeButton = WordButton({
        text: 'close',
        cls: ['close']
    });
    const btn_close = closeButton.render();
    
    let isGrabbing = false;
    let offsetX = 0;
    let offsetY = 0;

    cont_titlebar_action.appendChild(btn_close);

    cont_titlebar.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        isGrabbing = true;
        offsetX = e.clientX - component.offsetLeft;
        offsetY = e.clientY - component.offsetTop;
        cont_titlebar.classList.add('grabbing');
    });

    cont_titlebar.addEventListener('mouseleave', (e) => {
        e.stopPropagation();

        isGrabbing = false;
        cont_titlebar.classList.remove('grabbing');
    });

    cont_titlebar.addEventListener('mousemove', (e) => {
        e.stopPropagation();

        if (!isGrabbing) return;

        component.style.left = `${e.clientX - offsetX}px`;
        component.style.top = `${e.clientY - offsetY}px`;
    });

    cont_titlebar.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        document.body.style.userSelect = "";

        isGrabbing = false;
        cont_titlebar.classList.remove('grabbing');
    });

    btn_close.addEventListener('click', (e) => {
        if (component.classList.contains('modal')) return;

        e.stopPropagation();
        unrender();
    });

    /**
     * Retrieves the component if there is no argument. Renders the component otherwise. 
     * @param {HTMLElement} parent - The parent to where the component must be appended 
     * @returns The component itself
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);

        openingAnimation();
    };

    /**
     * Removes the component from its parent automatically
     */
    const unrender = () => {
        const parent = component.parentElement;

        component.classList.add('animate');
        component.classList.remove('opening');
        component.classList.add('closing');
        setTimeout(() => {
            component.classList.remove('animate');
        }, 200);

        setTimeout(() => {
            if (parent) parent.removeChild(component);
        }, 200);
    };

    /**
     * Shows the opening animation of the component. Usually used when render() didn't have an argument. 
     */
    const openingAnimation = () => {
        setTimeout(() => {
            component.classList.add('animate');
            component.classList.add('opening');
            setTimeout(() => {
                component.classList.remove('animate');
            }, 200);
        }, 0);
    };

    /**
     * Renders the message box as a modal.
     * @param {HTMLElement} parent - (Optional) The parent element of the element to where it must be appended. If no parent, it would otherwise create a background to which it would be appended
     * @returns 
     */
    const modal = async (parent) => {
        component.classList.add('modal');
        parent.appendChild(component);

        openingAnimation();

        return new Promise((resolve) => {
            const btn_confirm = component.querySelector('#window #actions #confirm');
            const btn_cancel = component.querySelector('#window #actions #cancel');

            if (btn_close) {
                btn_close.addEventListener('click', () => {
                    unrender();
                    resolve('close');
                });
            };
            
            if (btn_confirm) {
                btn_confirm.addEventListener('click', () => {
                    unrender();
                    resolve('confirm');
                });
            };
            
            if (btn_cancel) {
                btn_cancel.addEventListener('click', () => {
                    unrender();
                    resolve('cancel');
                });
            };
        })
    };

    return {
        render,
        unrender,
        modal,
        openingAnimation
    };
};

/**
 * Creates a confirm message box
 * @param {string} title - The title message on the title bar to be shown
 * @param {string} text - The message to be shown inside the window
 * @param {string} customConfirm - (Optional) A text string to be shown for the confirm button.
 */
export function ConfirmMessageBox(title, text, customConfirm = 'yes') {
    const template =
        `
        <div class="comp message-box confirm select-none">
            <div id="title-bar">
                <p id="title">Title</p>
                <div id="actions">
                    
                </div>
            </div>
            <div id="window">
                <p class="cursor-default" id="message">
                    > <span id="text">Text</span>
                </p>
                <div id="actions">
                    
                </div>
            </div>
        </div>
    `;

    const messageBox = MessageBox({
        title,
        text,
        htmlTemplate: template,
    });

    const cont_msgBox = messageBox.render();
    const cont_window_action = cont_msgBox.querySelector('#window #actions');
    const confirmButton = WordButton({
        text: customConfirm,
        id: 'confirm',
        isAlt: true
    });
    const cancelButton = WordButton({
        text: 'cancel',
        id: 'cancel',
        isAlt: true
    });

    const btn_confirm = confirmButton.render();
    const btn_cancel = cancelButton.render();

    cont_window_action.appendChild(btn_confirm);
    cont_window_action.appendChild(btn_cancel);

    return messageBox;
};

/**
 * Creates a inform message box.
 * @param {string} title - The title message on the title bar to be shown
 * @param {string} text - The message to be shown inside the window
 * @returns An InformMessageBox object
 */
export function InformMessageBox(title, text) {
    const template =
        `
        <div class="comp message-box inform select-none">
            <div id="title-bar">
                <p id="title">Title</p>
                <div id="actions">
                    
                </div>
            </div>
            <div id="window">
                <p class="cursor-default" id="message">
                    > <span id="text">Text</span>
                </p>
                <div id="actions">
                    
                </div>
            </div>
        </div>
    `;

    const messageBox = MessageBox({
        title: title || 'Message!',
        text: text || 'Information message',
        htmlTemplate: template
    });

    const cont_msgBox = messageBox.render();
    const cont_window_action = cont_msgBox.querySelector('#window #actions');
    const confirmButton = WordButton({
        text: 'O.K.',
        id: 'confirm',
        isAlt: true
    });

    const btn_confirm = confirmButton.render();

    cont_window_action.appendChild(btn_confirm);

    btn_confirm.addEventListener('click', (e) => {
        if (cont_msgBox.classList.contains('modal')) return;

        e.stopPropagation();
        messageBox.unrender();
    });

    return messageBox;
};