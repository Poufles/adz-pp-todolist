import Finestra from '../window.js';
import InputBlock from '../../input-block/input-block.js';
import { InformMessageBox } from '../../message-box/message-box.js';
import CRUD from '../../../scripts/crud.js';
import DateHandler from '../../../scripts/date-handler.js';

// CHANGE LATER
// IF THIS SHOULD REALLY BE A IIFE
function CreateTodo() {
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
        finestra.resetInputs();
    });

    btn_create.addEventListener('click', async () => {
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

        const response = VerifyInputs(input_name.inputComponent, input_deadline.inputComponent, input_project.inputComponent, input_color.inputComponent);

        if (response.status === 'n-invalid') {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Error!', 'A todo with the same name already exists. Please choose a new one.');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.enable();
            };

            return;
        };

        if (response.status === 't-invalid') {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Error!', 'Your time input is invalid. Please input a valid time.');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.enable();
            };

            return;
        };

        if (response.status === 'success') {
            const overlay = finestra.component.parentElement;
            const messageBox = InformMessageBox('Success!', 'A new todo has been successfully created!');

            finestra.disable();
            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.unrenderModal(true);
            };
        };
    });

    btn_close.addEventListener('click', () => {
        finestra.unrenderModal();
    });

    return finestra;
};

/**
 * Verifies the inputs.
 * @param {HTMLInputElement} name 
 * @param {HTMLInputElement} deadline 
 * @param {HTMLInputElement} project 
 * @param {HTMLInputElement} color 
 */
function VerifyInputs(name, deadline, project, color) {
    let status;
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
    
    const todo = CRUD.createTodo(input_name, timeString, input_project, input_color);

    return {
        status: todo.status,
        inputs: todo.inputs
    };
};

export default CreateTodo;