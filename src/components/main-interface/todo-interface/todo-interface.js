import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";
import CRUD from "../../../scripts/crud.js";
import DateHandler from "../../../scripts/date-handler.js";
import TodoBar from "../../todo-bar/todo-bar.js";
import CreateTodo from "../../finestra/create-todo/create-todo.js";
import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import OverdueInterface from "../overdue-interface/overdue-interface.js";

const TodoInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const todoInterface = MainInterface({
        id: 'todos',
        title: 'todos',
        titleCount: account.todo.length,
        description: 'todos are your tasks to be done. be sure that you will do them in time!',
    });

    todoInterface.addCreateButton();

    const template_subsection =
        `
        <div id="sub-section">
            <div class="actions select-none">
                <button type="button" class="btn action selected" id="today">
                    <span class="name">today</span>
                    <span class="count">| 0</span>
                </button>
                <button type="button" class="btn action" id="tomorrow">
                    <span class="name">tomorrow</span>
                    <span class="count">| 0</span>
                </button>
                <button type="button" class="btn action" id="upcoming">
                    <span class="name">upcoming</span>
                    <span class="count">| 0</span>
                </button>
            </div>
        </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template_subsection);
    const subSection = fragment.querySelector('#sub-section');
    const component = todoInterface.component;
    const cont_top = component.querySelector('.top');
    const button = cont_top.querySelector('.box-button');
    const content = component.querySelector('#content');
    const btn_today = subSection.querySelector('#today');
    const btn_tomorrow = subSection.querySelector('#tomorrow');
    const btn_upcoming = subSection.querySelector('#upcoming');

    const buttonArr = [];
    const todayArr = [];
    const tomorrowArr = [];
    const upcomingArr = [];

    buttonArr.push(btn_today);
    buttonArr.push(btn_tomorrow);
    buttonArr.push(btn_upcoming);

    component.insertBefore(subSection, content);
    subSection.appendChild(button);
    todoInterface.toggleReturnButton(false);

    const addInfo = (todoInfo) => {
        AddTodo(todoInfo, todayArr, tomorrowArr, upcomingArr, subSection, todoInterface);

        for (let index = 0; index < buttonArr.length; index++) {
            const button = buttonArr[index];

            if (button.classList.contains('selected')) {
                const dayType = button.querySelector('.name').textContent;
                switchContent(dayType);
            };
        };
    }

    const updateInfo = (todoId) => {
        UpdateInfo(todoInterface, todoId, todayArr, tomorrowArr, upcomingArr, subSection);

        for (let index = 0; index < buttonArr.length; index++) {
            const button = buttonArr[index];

            if (button.classList.contains('selected')) {
                const dayType = button.querySelector('.name').textContent;
                switchContent(dayType);
            };
        };
    };

    const switchContent = (type) => SwitchContent(type, todoInterface, todayArr, tomorrowArr, upcomingArr)

    todoInterface.addInfo = addInfo;
    todoInterface.updateInfo = updateInfo;
    todoInterface.switchContent = switchContent;
    todoInterface.todayTodosArr = todayArr;
    todoInterface.tomorrowTodosArr = tomorrowArr;
    todoInterface.upcomingTodosArr = upcomingArr;
    
    todoInterface.count = () => {
        return todayArr.length + tomorrowArr.length + upcomingArr.length
    };

    ButtonSwitcher(buttonArr, btn_today, 'today', switchContent);
    ButtonSwitcher(buttonArr, btn_tomorrow, 'tomorrow', switchContent);
    ButtonSwitcher(buttonArr, btn_upcoming, 'upcoming', switchContent);

    todoInterface.actionButtons.create.addEventListener('click', (e) => {
        e.stopPropagation();

        const main_interface = DashboardRuntime.componentActions.get('main-interface').component;
        const createTodo = CreateTodo();

        createTodo.modal(main_interface, 'todo');
        DashboardRuntime.objectActions.add('check-before-back', createTodo.checkValuesBeforeBack)
    });

    return todoInterface;
}();

function ButtonSwitcher(btnArr, button, type, switchContent) {
    button.addEventListener('click', (e) => {
        e.stopPropagation();

        for (let index = 0; index < btnArr.length; index++) {
            let btn = btnArr[index];

            if (btn.classList.contains('selected')) {
                btn.classList.remove('selected');
                break;
            };
        };

        button.classList.add('selected');
        switchContent(type);
    });
};

function AddTodo(todoInfo, todayArr, tomorrowArr, upcomingArr, subSection, todoInterface) {
    const dates = DateHandler.timeDifference(todoInfo.deadline);

    if (dates.isThisTimeToday && dates.millisecDifference >= 0) {
        
        const todoBar = TodoBar(todoInfo);
        todayArr.push(todoBar);

    } else if (dates.isThisTimeTomorrow) {
        
        const todoBar = TodoBar(todoInfo);
        tomorrowArr.push(todoBar);

    } else if (dates.daysDifference > 0 || dates.hoursDifference <= 24 && dates.millisecDifference >= 0) {
        
        const todoBar = TodoBar(todoInfo);
        upcomingArr.push(todoBar);
    
    };

    SortDeadlines(todayArr);
    SortDeadlines(tomorrowArr);
    SortDeadlines(upcomingArr);

    UpdateInterfaceCount(todayArr, tomorrowArr, upcomingArr, subSection, todoInterface);
};

function UpdateInfo(todoInterface, todoId, todayArr, tomorrowArr, upcomingArr, subSection) {
    let todo;

    if (!todo) todo = FindTodo(todoId, todayArr);

    if (!todo) todo = FindTodo(todoId, tomorrowArr);

    if (!todo) todo = FindTodo(todoId, upcomingArr);

    const dates = DateHandler.timeDifference(todo.information.deadline);

    if (todo.information.status !== 'deleted') {

        if (dates.millisecDifference < 0) {
            OverdueInterface.addInfo(todo.information);
        } else if (dates.isThisTimeToday && dates.millisecDifference >= 0) {
            todayArr.push(todo);
        } else if (dates.isThisTimeTomorrow) {
            tomorrowArr.push(todo);
        } else if (dates.daysDifference > 0 || dates.hoursDifference <= 24 && dates.millisecDifference >= 0) {
            upcomingArr.push(todo);
        };

    };

    SortDeadlines(todayArr);
    SortDeadlines(tomorrowArr);
    SortDeadlines(upcomingArr);

    UpdateInterfaceCount(todayArr, tomorrowArr, upcomingArr, subSection, todoInterface);
};

function FindTodo(todoId, arr) {
    for (let index = 0; index < arr.length; index++) {
        const todoObject = arr[index];
        const todoObjectId = todoObject.information.id;

        if (todoId == todoObjectId) {
            arr.splice(index, 1);
            return todoObject;
        };
    };

    return undefined;
};

function UpdateInterfaceCount(todayArr, tomorrowArr, upcomingArr, subSection, todoInterface) {
    const todayCount = todayArr.length;
    const tomorrowCount = tomorrowArr.length;
    const upcomingCount = upcomingArr.length;

    const allTodosCount = todayCount + tomorrowCount + upcomingCount;
    const span_todayCount = subSection.querySelector('#today .count');
    const span_tomorrowCount = subSection.querySelector('#tomorrow .count');
    const span_upcomingCount = subSection.querySelector('#upcoming .count');

    todoInterface.changeTitleCount(allTodosCount);
    span_todayCount.textContent = `| ${todayCount}`;
    span_tomorrowCount.textContent = `| ${tomorrowCount}`;
    span_upcomingCount.textContent = `| ${upcomingCount}`;
};

/**
 * Sorts the deadlines of todos
 * @param {Array} arr 
 */
function SortDeadlines(arr) {
    let isSorted = false;

    while (!isSorted) {
        isSorted = true;

        for (let index = 0; index < arr.length - 1; index++) {
            const currentElement = arr[index];
            const nextElement = arr[index + 1];

            const currentMS = DateHandler.timeDifference(currentElement.information.deadline);
            const nextMS = DateHandler.timeDifference(nextElement.information.deadline);

            if (currentMS.millisecDifference > nextMS.millisecDifference) {
                const temp = arr[index];

                arr[index] = nextElement;
                arr[index + 1] = temp;

                isSorted = false;
            };
        };
    };
};

function SwitchContent(dayType, todoInterface, todayArr, tomorrowArr, upcomingArr) {

    todoInterface.removeContent({ all: true });

    if (dayType === 'today') {
        todayArr.forEach(todo => todoInterface.addContent(todo));
    };

    if (dayType === 'tomorrow') {
        tomorrowArr.forEach(todo => todoInterface.addContent(todo));
    };

    if (dayType === 'upcoming') {
        upcomingArr.forEach(todo => todoInterface.addContent(todo));
    };
};

export default TodoInterface
