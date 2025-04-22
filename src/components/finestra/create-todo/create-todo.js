import Finestra from '../window.js';
import InputBlock from '../../input-block/input-block.js';
import { InformMessageBox } from '../../message-box/message-box.js';

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

        if (response) {
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
    const input_name = name.value;
    const input_project = project.value;
    const input_color = color.value;
    const inputTimeArr = deadline.inputComponent.querySelectorAll('input');

    // CREATE VERIFICATION FOR LATER //

    return true;
};

export default CreateTodo;