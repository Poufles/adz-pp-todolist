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
    const closeButton = WordButton('close');
    const btn_close = closeButton.render();

    cont_titlebar_action.appendChild(btn_close);

    let isGrabbing = false;
    let offsetX = 0;
    let offsetY = 0;

    cont_titlebar.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        isGrabbing = true;
        offsetX = e.clientX - component.offsetLeft;
        offsetY = e.clientY - component.offsetTop;
        cont_titlebar.classList.add('grabbing');
    });

    cont_titlebar.addEventListener('mousemove', (e) => {
        e.stopPropagation();

        if (!isGrabbing) return;

        component.style.left = `${e.clientX - offsetX}px`;
        component.style.top = `${e.clientY - offsetY}px`;
    });

    cont_titlebar.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
    
        isGrabbing = false;
        cont_titlebar.classList.remove('grabbing');
    });

    cont_titlebar.addEventListener('mouseup', (e) => {
        e.stopPropagation();

        isGrabbing = false;
        cont_titlebar.classList.remove('grabbing');
    });

    btn_close.addEventListener('click', (e) => {
        e.stopPropagation();

        const parent = component.parentElement;

        parent.removeChild(component);
    });

    const render = () => component;

    return {
        render
    };
};

/**
 * Creates a confirm message box
 * @param {HTMLElement} component 
 * @param {String} template
 */
export function ConfirmMessageBox(title, text) {
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
 * Creates a inform message box
 * @param {HTMLElement} component 
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
        title,
        text,
        htmlTemplate: template,
        onCreate: (component) => {
            const confirmButton = WordButton('O.K.', 'confirm', true);

            const cont_window_action = component.querySelector('#window #actions');
            const btn_confirm = confirmButton.render();

            cont_window_action.appendChild(btn_confirm);

            btn_confirm.addEventListener('click', (e) => {
                const parent = component.parentElement;

                parent.removeChild(component);
            });
        }
    });

    return messageBox;
};