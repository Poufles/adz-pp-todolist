import CRUD from "../../scripts/crud.js";
import DashboardRuntime from "../../scripts/dashboard-runtime.js";

function StickyNote(stickyObject) {
    const template = `
        <div class="sticky-note-shadow">
        <article class="comp sticky-note">
            <div class="info-wrapper">
                <div class="main-content">
                    <div id="actions">
                        <div id="crud">
                            <button class="btn" type="button" id="view">
                                <span>
                                    &lt;&gt;
                                </span>
                            </button>
                            <button class="btn" type="button" id="edit"><svg viewBox="0 0 40 40" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M31.6467 3.35333L36.6467 8.35333L32.835 12.1667L27.835 7.16667L31.6467 3.35333ZM13.3333 26.6667H18.3333L30.4783 14.5217L25.4783 9.52167L13.3333 21.6667V26.6667Z"
                                        fill="" />
                                    <path
                                        d="M31.6667 31.6667H13.5967C13.5533 31.6667 13.5083 31.6833 13.465 31.6833C13.41 31.6833 13.355 31.6683 13.2983 31.6667H8.33333V8.33333H19.745L23.0783 5H8.33333C6.495 5 5 6.49333 5 8.33333V31.6667C5 33.5067 6.495 35 8.33333 35H31.6667C32.5507 35 33.3986 34.6488 34.0237 34.0237C34.6488 33.3986 35 32.5507 35 31.6667V17.22L31.6667 20.5533V31.6667Z"
                                        fill="" />
                                </svg>
                            </button>
                            <button class="btn" type="button" id="delete">
                                <?xml version="1.0" ?><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h48v48H0V0z" fill="none" />
                                    <path
                                        d="M12 38c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V14H12v24zm4.93-14.24l2.83-2.83L24 25.17l4.24-4.24 2.83 2.83L26.83 28l4.24 4.24-2.83 2.83L24 30.83l-4.24 4.24-2.83-2.83L21.17 28l-4.24-4.24zM31 8l-2-2H19l-2 2h-7v4h28V8z" />
                                    <path d="M0 0h48v48H0z" fill="none" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <textarea name="" id="note" placeholder="Write something pretty...">${stickyObject.desc || ''}</textarea>
                </div>
            </div>
        </article>
    </div>
    `;

    const template_overlay = `
        <div class="overlay"></div>
    `;

    let currentState;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const fragmentOverlay = range.createContextualFragment(template_overlay);
    const overlay = fragmentOverlay.querySelector('div');
    const component = fragment.querySelector('.sticky-note-shadow');
    const componentMainArticle = component.querySelector('.comp.sticky-note');
    const textarea = componentMainArticle.querySelector('textarea#note');
    const actions = componentMainArticle.querySelector('#crud');
    const btn_view = actions.querySelector('#view');
    const btn_edit = actions.querySelector('#edit');
    const btn_delete = actions.querySelector('#delete');

    componentMainArticle.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    textarea.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            stickyObject.desc = textarea.value;
            CRUD.updateSticky(stickyObject)
        };
    });

    textarea.addEventListener('blur', (e) => {
        e.stopPropagation();

        stickyObject.desc = textarea.value;
        CRUD.updateSticky(stickyObject)
    });

    overlay.addEventListener('click', (e) => {
        e.stopPropagation();

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const mainRect = main_interface.getBoundingClientRect();
        const componentRect = component.getBoundingClientRect();
        const compRect = componentMainArticle.getBoundingClientRect();
        const actualWidth = component.offsetWidth;
        const component_pos = `--parent-top: ${componentRect.top - mainRect.top}px; --parent-left: ${componentRect.left - mainRect.left}px`;
        const starting_style = `--starting-top: ${compRect.top - mainRect.top}px; --starting-left: ${compRect.left - mainRect.left}px`;

        componentMainArticle.classList.remove('view');
        componentMainArticle.classList.add('return');

        componentMainArticle.setAttribute('style', starting_style + '; ' + component_pos + '; --actual-width: ' + actualWidth + 'px');

        overlay.classList.remove('show');
        main_interface.appendChild(componentMainArticle);
        main_interface.removeChild(overlay);
        setTimeout(() => {
            componentMainArticle.classList.remove('return');
            component.appendChild(componentMainArticle);
            currentState = undefined;
        }, 170);
    });

    btn_view.addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentState === 'view') return;

        currentState = 'view';

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const mainRect = main_interface.getBoundingClientRect();
        const compRect = component.getBoundingClientRect()
        const actualWidth = component.offsetWidth;
        const starting_style = `--starting-top: ${compRect.top - mainRect.top}px; --starting-left: ${compRect.left - mainRect.left}px; --actual-width: ${actualWidth}px`;

        main_interface.appendChild(overlay);
        overlay.classList.add('show');

        component.removeChild(componentMainArticle);
        overlay.appendChild(componentMainArticle);
        componentMainArticle.classList.add('view');
        componentMainArticle.setAttribute('style', starting_style);
    })

    /**
     * Renders the component
     * @param {HTMLElement} parent - The parent element to where the component must be appended to 
     * @returns The component if no parent is provided
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Automatically unrenders the component
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && !parent.contains(component));
    };

    return {
        component,
        componentMainArticle,
        render,
        unrender
    }
};

export default StickyNote;