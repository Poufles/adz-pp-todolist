import CRUD from "../../scripts/crud.js";
import DashboardRuntime from "../../scripts/dashboard-runtime.js";
import CreateSticky from "../finestra/create-note/create-note.js";
import ProjectInterface from "../main-interface/project-interface/project-interface.js";
import StickyInterface from "../main-interface/sticky-interface/sticky-interface.js";
import TodoInterface from "../main-interface/todo-interface/todo-interface.js";
import { ConfirmMessageBox } from "../message-box/message-box.js";

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

    let isMouseDown = false;
    let isEnabled = true;
    let isViewed = false;
    let isBeingDeleted = false;

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

        const finestraStickies = DashboardRuntime.componentActions.get('finestra-stickies');

        if (finestraStickies.component.contains(component)) {
            TransitionToInterface(finestraStickies); return;
        };
    });

    textarea.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        const finestraStickies = DashboardRuntime.componentActions.get('finestra-stickies');

        if (finestraStickies.component.contains(component)) {
            e.preventDefault();

            isMouseDown = true;
        };
    });

    textarea.addEventListener('mouseup', (e) => {
        e.stopPropagation();

        const finestraStickies = DashboardRuntime.componentActions.get('finestra-stickies');

        if (finestraStickies.component.contains(component)) {
            e.preventDefault();

            if (isMouseDown) {
                TransitionToInterface(finestraStickies);
                isMouseDown = false;

                return;
            };
        };
    });

    textarea.addEventListener('mouseleave', (e) => {
        e.stopPropagation();

        const finestraStickies = DashboardRuntime.componentActions.get('finestra-stickies');

        if (finestraStickies.component.contains(component)) {
            e.preventDefault();
            isMouseDown = false;
        };
    });

    textarea.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            stickyObject.desc = textarea.value;
            CRUD.updateSticky(stickyObject);

            UpdateStickyWindow(stickyObject);
        };
    });
    
    textarea.addEventListener('blur', (e) => {
        e.stopPropagation();
        
        stickyObject.desc = textarea.value;
        CRUD.updateSticky(stickyObject)
        
        UpdateStickyWindow(stickyObject);
    });

    overlay.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (isBeingDeleted) {

        };

        if (isViewed) {
            ExitAnimation(componentMainArticle, component, overlay);

            setTimeout(() => {
                isViewed = false;
            }, 200);
        };
    });

    btn_view.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isViewed) return;

        isViewed = true;

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const mainRect = main_interface.getBoundingClientRect();
        const compShadowRect = component.getBoundingClientRect()
        const actualWidth = component.offsetWidth;
        const starting_style = `--starting-top: ${compShadowRect.top - mainRect.top}px; --starting-left: ${compShadowRect.left - mainRect.left}px; --actual-width: ${actualWidth}px`;

        main_interface.appendChild(overlay);
        overlay.classList.add('show');

        component.removeChild(componentMainArticle);
        overlay.appendChild(componentMainArticle);
        componentMainArticle.classList.add('view');
        componentMainArticle.setAttribute('style', starting_style);
    });

    btn_edit.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isEnabled) return;

        disable();

        if (isViewed) {
            ExitAnimation(componentMainArticle, component, overlay);

            setTimeout(() => {
                isViewed = false;
            }, 200);
        };

        const mainInterfaceObj = DashboardRuntime.componentActions.get('main-interface');

        const createSticky = CreateSticky();

        createSticky.editMode(stickyObject, updateInfo);
        createSticky.modal(mainInterfaceObj.component, 'sticky', true);
        DashboardRuntime.objectActions.add('task-enable', enable)
        DashboardRuntime.objectActions.add('check-before-back', createSticky.checkValuesBeforeBack)
    });

    btn_delete.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (isBeingDeleted) return;

        disable();

        isBeingDeleted = true;

        const messageBox = ConfirmMessageBox('Delete todo?', 'This will be permanently deleted. Are you sure?');

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;

        const response = await messageBox.modal(undefined, main_interface);

        if (response !== 'confirm') {
            enable();
            isBeingDeleted = false;

            return;
        };

        const status = CRUD.deleteTask(stickyObject.id, 'sticky');

        if (status === 'u-invalid') {
            return;
        };

        disable();
        StickyInterface.removeContent({
            id: stickyObject.id
        });

        UpdateStickyWindow();
    });

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
        ExitAnimation(componentMainArticle, component, overlay);

        setTimeout(() => {
            const parent = component.parentElement;

            if (parent && parent.contains(component)) parent.removeChild(component);
        }, 600);
    };

    /**
     * Enables the component
     */
    const enable = () => {
        isEnabled = true;

        btn_view.disabled = false;
        btn_edit.disabled = false;
        btn_delete.disabled = false;
        textarea.disabled = false;
    };

    /**
     * Disables the component
     */
    const disable = () => {
        isEnabled = false;

        btn_view.disabled = true;
        btn_edit.disabled = true;
        btn_delete.disabled = true;
        textarea.disabled = true;
    };

    /**
     * Updates the todo information object of the component and its visuals 
     * @param {object} newInfo 
     */
    const updateInfo = (newInfo) => {
        enable();

        for (const key in newInfo) {
            if (stickyObject.hasOwnProperty(key)) {
                stickyObject[key] = newInfo[key];
            };
        };
    };

    return {
        information: stickyObject,
        component,
        componentMainArticle,
        render,
        unrender,
        enable,
        disable,
        updateInfo
    }
};

function ExitAnimation(component, componentShadow, overlay) {
    const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
    const mainRect = main_interface.getBoundingClientRect();
    const compShadowRect = componentShadow.getBoundingClientRect();
    const compRect = component.getBoundingClientRect();
    const actualWidth = component.offsetWidth;
    const component_pos = `--parent-top: ${compShadowRect.top - mainRect.top}px; --parent-left: ${compShadowRect.left - mainRect.left}px`;
    const starting_style = `--starting-top: ${compRect.top - mainRect.top}px; --starting-left: ${compRect.left - mainRect.left}px`;

    component.classList.remove('view');
    component.classList.add('return');

    component.setAttribute('style', starting_style + '; ' + component_pos + '; --actual-width: ' + actualWidth + 'px');

    overlay.classList.remove('show');
    main_interface.appendChild(component);
    if (main_interface.contains(overlay)) main_interface.removeChild(overlay);
    setTimeout(() => {
        component.classList.remove('return');
        componentShadow.appendChild(component);
    }, 170);
};

function TransitionToInterface(finestraStickies) {
    const finestraTodos = DashboardRuntime.componentActions.get('finestra-todos').object;
    const finestra_projects = DashboardRuntime.componentActions.get('finestra-projects').object;

    DashboardRuntime.switchPanel({
        fromFinestra: finestraStickies.object,
        toInterface: StickyInterface,
        oppositeInterfacesNWindows: {
            firstAlt: {
                finestra: finestraTodos,
                interface: TodoInterface
            },
            secondAlt: {
                finestra: finestra_projects,
                interface: ProjectInterface
            },
        }
    });
};

function UpdateStickyWindow() {
    const refreshWindow = DashboardRuntime.refreshWindow;
    const finestraStickies = DashboardRuntime.componentActions.get('finestra-stickies');

    refreshWindow(StickyInterface.getContentArray(), finestraStickies.object, StickyNote);

    const stickyCount = StickyInterface.getContentArray().length;

    finestraStickies.object.changeTitle(`stickies | ${stickyCount}`);
};

export default StickyNote;