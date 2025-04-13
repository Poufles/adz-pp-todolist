import WordButton from '../buttons/word-button/word-button.js';

/**
 * 
 * @returns 
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

        setTimeout(() => {
            component.classList.add('animate');
            component.classList.add('opening');
            setTimeout(() => {
                component.classList.remove('animate');
            }, 200);
        }, 0);
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
     * Renders the message box as a modal.
     * @param {boolean} hasBackground - (Optional) Adds a background on the modal to hinder other actions.
     * @returns 
     */
    const modal = async (hasBackground = true) => {
        return new Promise((resolve) => {
            const btn_confirm = component.querySelector('#window #actions #confirm');
            const btn_cancel = component.querySelector('#window #actions #cancel');

            if (btn_close) {
                btn_close.addEventListener('click', () => {
                    resolve('close');
                });
            };

            if (btn_confirm) {
                btn_confirm.addEventListener('click', () => {
                    resolve('confirm');
                });
            };
            
            if (btn_cancel) {
                btn_confirm.addEventListener('click', () => {
                    resolve('cancel');
                });
            };
        })
    };

    return {
        render,
        unrender,
        modal
    };
};

/**
 * Creates a confirm message box
 * @param {string} title - The title message on the title bar to be shown
 * @param {string} text - The message to be shown inside the window
 */
export async function ConfirmMessageBox(title, text) {
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
        onCreate: (component) => {

        }
    });

    console.log(messageBox);

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
        e.stopPropagation();
        messageBox.unrender();
    });

    return messageBox;
};