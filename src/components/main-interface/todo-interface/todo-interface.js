import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";
import CRUD from "../../../scripts/crud.js";
import DateHandler from "../../../scripts/date-handler.js";
import TodoBar from "../../todo-bar/todo-bar.js";

const TodoInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const todoInterface = MainInterface({
        id: 'todos',
        title: 'todos',
        titleCount: account.todo.length, // CHANGE LATER
        description: 'todos are your tasks to be done. be sure that you will do them in time!',
        buttonText: 'create',
        buttonId: 'create'
    });

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
    cont_top.removeChild(button);
    subSection.appendChild(button);
    todoInterface.toggleReturnButton(false);

    UpdateInfo(todoInterface, todayArr, tomorrowArr, upcomingArr, subSection);

    SwitchContent('today', todoInterface, todayArr, tomorrowArr, upcomingArr)

    const updateInfo = () => UpdateInfo(todoInterface, todayArr, tomorrowArr, upcomingArr, subSection);

    const switchContent = (type) => SwitchContent(type, todoInterface, todayArr, tomorrowArr, upcomingArr)

    todoInterface.updateInfo = updateInfo;
    todoInterface.switchContent = switchContent;

    ButtonSwitcher(buttonArr, btn_today, 'today', switchContent);
    ButtonSwitcher(buttonArr, btn_tomorrow, 'tomorrow', switchContent);
    ButtonSwitcher(buttonArr, btn_upcoming, 'upcoming', switchContent);

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
}

function UpdateInfo(todoInterface, todayArr, tomorrowArr, upcomingArr, subSection) {
    const todos = CRUD.getTasks('todo');

    for (let index = 0; index < todos.length; index++) {
        const todo = todos[index];

        const dates = DateHandler.timeDifference(todo.deadline);

        if (dates.isThisTimeToday) {
            const todoBar = TodoBar(todo);
            todayArr.push(todoBar); 

            continue;
        };

        if (dates.isThisTimeTomorrow) {
            const todoBar = TodoBar(todo);
            tomorrowArr.push(todoBar); 
            
            continue;
        }

        if (dates.daysDifference > 0 || dates.hoursDifference <= 24) {
            const todoBar = TodoBar(todo);
            upcomingArr.push(todoBar); 
            
            continue;
        };
    };

    const todayCount = todayArr.length;
    const tomorrowCount = tomorrowArr.length;
    const upcomingCount = upcomingArr.length;

    const allTodosCount = todayCount + tomorrowCount + upcomingCount;
    const span_todayCount = subSection.querySelector('#today .count');
    const span_tomorrowCount = subSection.querySelector('#tomorrow .count');
    const span_upcomingCount = subSection.querySelector('#upcoming .count');

    todoInterface.changeTitleCount(allTodosCount);
    span_todayCount.textContent = todayCount;
    span_tomorrowCount.textContent = tomorrowCount;
    span_upcomingCount.textContent = upcomingCount;
};

function SwitchContent(type, todoInterface, todayArr, tomorrowArr, upcomingArr) {
    todoInterface.removeContent({ all: true });

    if (type === 'today') {
        todayArr.forEach(todo => todoInterface.addContent(todo));
    };

    if (type === 'tomorrow') {
        tomorrowArr.forEach(todo => todoInterface.addContent(todo));
    };

    if (type === 'upcoming') {
        upcomingArr.forEach(todo => todoInterface.addContent(todo));
    };
};

export default TodoInterface
