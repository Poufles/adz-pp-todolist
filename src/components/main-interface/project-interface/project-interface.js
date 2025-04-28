import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";
import OverdueInterface from "../overdue-interface/overdue-interface.js";
import StickyInterface from "../sticky-interface/sticky-interface.js";
import TodoInterface from "../todo-interface/todo-interface.js";

const ProjectInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const projectInterface = MainInterface({
        id: 'projects',
        title: 'projects',
        titleCount: account.project.length, // CHANGE LATER
        description: 'todos compiled and organized in order to complete as a whole.',
        buttonText: 'create',
        buttonId: 'create'
    });

    projectInterface.addCreateButton();

    projectInterface.changeReturnButtonText('go back to todos');
    const btn_return = projectInterface.returnButton;

    projectInterface.actionButtons.create.addEventListener('click', (e) => {
        e.stopPropagation();
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

    return projectInterface;
}();

export default ProjectInterface;