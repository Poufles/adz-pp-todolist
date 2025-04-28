import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import StorageHandler from "../../../scripts/storage-handler.js";
import CreateSticky from "../../finestra/create-note/create-note.js";
import MainInterface from "../main-interface.js";
import OverdueInterface from "../overdue-interface/overdue-interface.js";
import ProjectInterface from "../project-interface/project-interface.js";
import TodoInterface from "../todo-interface/todo-interface.js";

const StickyInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const stickyInterface = MainInterface({
        id: 'stickies',
        title: 'stickies',
        titleCount: account.sticky.length, // CHANGE LATER
        description: 'stickies are sticky notes. may it be random gibberish or lists, write any!',
        buttonText: 'create',
        buttonId: 'create'
    });

    stickyInterface.addCreateButton();

    stickyInterface.changeReturnButtonText('go back to todos');
    const btn_return = stickyInterface.returnButton;

    stickyInterface.actionButtons.create.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const createSticky = CreateSticky();

        createSticky.modal(main_interface, 'sticky');
        DashboardRuntime.objectActions.add('check-before-back', createSticky.checkValuesBeforeBack);
    });

    btn_return.addEventListener('click', () => {
        const finestra_todos = DashboardRuntime.componentActions.get('finestra-todos').object;
        const finestra_stickies = DashboardRuntime.componentActions.get('finestra-stickies').object;
        const finestra_projects = DashboardRuntime.componentActions.get('finestra-projects').object;
        const finestra_overdue = DashboardRuntime.componentActions.get('finestra-overdues').object;

        DashboardRuntime.switchPanel({
            fromFinestra: finestra_todos,
            toInterface: TodoInterface,
            oppositeInterfacesNWindows: {
                firstAlt: {
                    finestra: finestra_stickies,
                    interface: StickyInterface
                },
                secondAlt: {
                    finestra: finestra_projects,
                    interface: ProjectInterface
                },
                thirdAlt: {
                    finestra: finestra_overdue,
                    interface: OverdueInterface
                }
            }
        });
    });

    return stickyInterface;
}();

export default StickyInterface;