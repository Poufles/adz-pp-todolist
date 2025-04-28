import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import DateHandler from "../../../scripts/date-handler.js";
import StorageHandler from "../../../scripts/storage-handler.js";
import TodoBar from "../../todo-bar/todo-bar.js";
import MainInterface from "../main-interface.js";
import ProjectInterface from "../project-interface/project-interface.js";
import StickyInterface from "../sticky-interface/sticky-interface.js";
import TodoInterface from "../todo-interface/todo-interface.js";

const OverdueInterface = function () {
    const account = StorageHandler.GetStorage(true);
    const todos = account.todo;
    let count = 0;

    for (let index = 0; index < todos.length; index++) {
        const todo = todos[index];
        const timeDiff = DateHandler.timeDifference(todo.deadline);

        if (timeDiff.millisecDifference < 0) count++
    };

    const overdueInterface = MainInterface({
        id: 'overdues',
        title: 'overdues',
        titleCount: count,
        description: 'failing to complete todos can usually occur. all of overdue todos appear here.',
        buttonText: 'create',
        buttonId: 'create'
    });

    const overduesArr = [];

    overdueInterface.addDeleteButton('delete all');

    overdueInterface.changeReturnButtonText('go back to todos');
    const btn_return = overdueInterface.returnButton;

    overdueInterface.actionButtons.delete.addEventListener('click', (e) => {
        e.stopPropagation();

        const length = overdueInterface.getContentArray().length;

        if (length > 0) {

        };
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

    const addInfo = (todoInfo) => AddOverdue(todoInfo, overduesArr, overdueInterface);
    const updateInfo = () => { };
    const updateWindow = () => UpdateOverdueWindow(overduesArr);

    overdueInterface.addInfo = addInfo;
    overdueInterface.updateWindow = updateWindow;
    overdueInterface.overduesArr = overduesArr;

    return overdueInterface;
}();

function AddOverdue(todoInfo, overduesArr) {
    OverdueInterface.removeContent({ all: true });

    const todoBar = TodoBar(todoInfo);
    overduesArr.push(todoBar);

    let isSorted = false;

    while (!isSorted) {
        isSorted = true;

        for (let index = 0; index < overduesArr.length - 1; index++) {
            const currentElement = overduesArr[index];
            const nextElement = overduesArr[index + 1];

            const currentMS = DateHandler.timeDifference(currentElement.information.deadline);
            const nextMS = DateHandler.timeDifference(nextElement.information.deadline);

            if (currentMS.millisecDifference > nextMS.millisecDifference) {
                const temp = overduesArr[index];

                overduesArr[index] = nextElement;
                overduesArr[index + 1] = temp;

                isSorted = false;
            };
        };
    };

    const count = overduesArr.length;
    OverdueInterface.changeTitleCount(count);
    overduesArr.forEach(todo => OverdueInterface.addContent(todo));
};

function UpdateOverdueWindow(overduesArr) {
    const finestra_overdues = DashboardRuntime.componentActions.get('finestra-overdues').object;

    finestra_overdues.removeContent();

    overduesArr.forEach(todo => {
        const todoInfo = todo.information;
        const todoBar = TodoBar(todoInfo);

        finestra_overdues.addContent(todoBar)
    });
};

export default OverdueInterface;