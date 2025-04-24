import Finestra from '../window.js';
import InputBlock from '../../input-block/input-block.js';
import { InformMessageBox } from '../../message-box/message-box.js';
import CRUD from '../../../scripts/crud.js';
import DateHandler from '../../../scripts/date-handler.js';
import TodoBar from '../../todo-bar/todo-bar.js';
import TodoInterface from '../../main-interface/todo-interface/todo-interface.js';

// CHANGE LATER
// IF THIS SHOULD REALLY BE A IIFE
function CreateTodo() {
    let isEdit = false;
    let todoObject;
    let todoObjectUpdateFunction;

    const finestra = Finestra({
        hasActions: true,
        id: 'creator-todo',
        windowTitle: 'create todo...',
        titleButtonText: 'back',
    });

    const input_name = InputBlock({
        inputType: 'multi',
        inputId: 'item-name',
        title: 'Todo name',
        hint: {
            hasHint: true,
            title: 'Max character',
            message: '40 characters'
        }
    });

    input_name.addPlaceholder('make a coffee');

    const input_deadline = InputBlock({
        inputType: 'time',
        inputId: 'item-deadline',
        title: 'Deadline',
        hint: {
            hasHint: true,
            title: 'format',
            message: 'hh:mma | mm/dd/yy'
        }
    });

    const input_project = InputBlock({
        inputType: 'one',
        inputId: 'item-project',
        title: 'Assign to project',
        isOptional: true,
        hint: {
            hasHint: true,
            title: 'suggestion',
            clickable: true
        }
    });

    input_project.addPlaceholder('either project name or not'); // CHANGE LATER

    const input_color = InputBlock({
        inputType: 'one',
        inputId: 'item-color',
        title: 'Todo color',
        hint: {
            hasHint: true,
            title: 'color pool',
            clickable: true
        }
    });

    input_color.addPlaceholder('green');

    finestra.addContent(input_name);
    finestra.addContent(input_deadline);
    finestra.addContent(input_project);
    finestra.addContent(input_color);
    finestra.addBottomMessage('experience to earn: 5xp');

    const finestraButtons = finestra.componentButtonsArr;
    const btn_close = finestra.closeButton;
    let btn_reset, btn_create;

    for (let index = 0; index < finestraButtons.length; index++) {
        const button = finestraButtons[index].component;

        if (button.id === 'reset') {
            btn_reset = button;

            continue;
        };

        if (button.id === 'confirm') {
            btn_create = button;

            break;
        };
    };

    btn_reset.addEventListener('click', () => {
        if (isEdit) {
            EditTodo(todoObject, input_name, input_deadline, input_project, input_color);

            return;
        };

        finestra.resetInputs();
    });

    btn_create.addEventListener('click', async () => {
        let responseVerify;

        if (!finestra.inputsHasValue()) {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Error!', 'Please complete the required information');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.enable();
            };

            return;
        };

        if (isEdit) {
            responseVerify = VerifyInputs(input_name.inputComponent, input_deadline.inputComponent, input_project.inputComponent, input_color.inputComponent, todoObject.id, true);
        } else {
            responseVerify = VerifyInputs(input_name.inputComponent, input_deadline.inputComponent, input_project.inputComponent, input_color.inputComponent);
        };

        if (responseVerify.status === 'n-invalid') {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Error!', 'A todo with the same name already exists. Please choose a new one.');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.enable();
            };

            return;
        };

        if (responseVerify.status === 't-invalid') {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Error!', 'Your time input is invalid. Please input a valid time.');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.enable();
            };

            return;
        };

        if (responseVerify.status === 'success') {
            let messageBox;
            const overlay = finestra.component.parentElement;

            if (isEdit) {
                messageBox = InformMessageBox('Success!', 'Your todo has been successfully updated!');
            } else {
                messageBox = InformMessageBox('Success!', 'A new todo has been successfully created!');
            };

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.unrenderModal(true);

                if (isEdit) {
                    todoObjectUpdateFunction(responseVerify.inputs);
                } else {
                    const todoBar = TodoBar(responseVerify.inputs);
                    TodoInterface.addContent(todoBar);
                };
            };
        };
    });

    btn_close.addEventListener('click', () => {
        finestra.unrenderModal();
    });

    /**
     * To edit a todo information
     */
    const editMode = (todoObjectInfo, updateInfo) => {
        isEdit = true;
        todoObject = todoObjectInfo;
        todoObjectUpdateFunction = updateInfo;

        EditTodo(todoObject, input_name, input_deadline, input_project, input_color);
    };

    finestra.editMode = editMode;

    return finestra;
};

function EditTodo(todoObject, inputName, inputDeadline, inputProject, inputColor) {
    inputName.inputComponent.value = todoObject.name;
    inputName.addPlaceholder(todoObject.name);

    inputProject.addPlaceholder(todoObject.project);

    inputColor.inputComponent.value = todoObject.color;
    inputColor.addPlaceholder(todoObject.color);

    const inputsArr = [];
    const inputs = inputDeadline.inputComponent.querySelectorAll('input');

    inputs.forEach(input => {
        inputsArr.push(input);
    });

    EditTime(todoObject.deadline, inputsArr);
};

function EditTime(time, inputsArr) {
    const hour = DateHandler.getTimeSlice(time, 'hour');
    const date = DateHandler.getTimeSlice(time, 'date');
    const [hourNums, minMeridNums] = hour.split(':');
    const meridian = minMeridNums.slice(2, 4);
    const [mNums, dNums, yNums] = date.split('/');
    const fullTime = hourNums + minMeridNums.slice(0, 2) + 'm' + mNums + dNums + yNums;

    for (let index = 0; index < inputsArr.length; index++) {
        const input = inputsArr[index];

        if (input.type === 'button') {
            input.value = meridian;
            input.placeholder = meridian;
            continue;
        };

        input.value = fullTime[index];
        input.placeholder = fullTime[index];
    };
};

/**
 * Verifies the inputs.
 * @param {HTMLInputElement} name 
 * @param {HTMLInputElement} deadline 
 * @param {HTMLInputElement} project 
 * @param {HTMLInputElement} color 
 */
function VerifyInputs(name, deadline, project, color, id = undefined, isEdit = false) {
    const input_name = name.value || color.placeholder;
    const input_project = project.value;
    const input_color = color.value || color.placeholder;
    const inputTimeArr = deadline.querySelectorAll('input');

    const input_ht = inputTimeArr[0].value || inputTimeArr[0].placeholder;
    const input_ho = inputTimeArr[1].value || inputTimeArr[1].placeholder;
    const input_mt = inputTimeArr[2].value || inputTimeArr[2].placeholder;
    const input_mo = inputTimeArr[3].value || inputTimeArr[3].placeholder;
    const input_meridian = inputTimeArr[4].value;
    const input_Mt = inputTimeArr[5].value || inputTimeArr[5].placeholder;
    const input_Mo = inputTimeArr[6].value || inputTimeArr[6].placeholder;
    const input_dt = inputTimeArr[7].value || inputTimeArr[7].placeholder;
    const input_do = inputTimeArr[8].value || inputTimeArr[8].placeholder;
    const input_ym = inputTimeArr[9].value || inputTimeArr[9].placeholder;
    const input_yc = inputTimeArr[10].value || inputTimeArr[10].placeholder;
    const input_yt = inputTimeArr[11].value || inputTimeArr[11].placeholder;
    const input_yd = inputTimeArr[12].value || inputTimeArr[12].placeholder;

    const timeString = `${input_ht}${input_ho}:${input_mt}${input_mo}${input_meridian} @ ${input_Mt}${input_Mo}/${input_dt}${input_do}/${input_ym}${input_yc}${input_yt}${input_yd}`;

    let todo;

    if (isEdit) {
        todo = CRUD.updateTodo(id, input_name, timeString, input_project, input_color);
    } else {
        todo = CRUD.createTodo(input_name, timeString, input_project, input_color);
    };

    return {
        status: todo.status,
        inputs: todo.inputs
    };
};

export default CreateTodo;