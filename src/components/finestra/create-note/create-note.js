import CRUD from "../../../scripts/crud.js";
import InputBlock from "../../input-block/input-block.js";
import StickyInterface from "../../main-interface/sticky-interface/sticky-interface.js";
import { InformMessageBox } from "../../message-box/message-box.js";
import StickyNote from "../../sticky-note/sticky-note.js";
import Finestra from "../window.js";

function CreateSticky() {
    let isEdit = false;
    let stickyObject;
    let stickyObjectUpdateFunction;

    const finestra = Finestra({
        hasActions: true,
        id: 'creator-sticky',
        windowTitle: 'create sticky...',
        titleButtonText: 'back',
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

    input_project.addPlaceholder('change later bruh');

    const input_color = InputBlock({
        inputType: 'one',
        inputId: 'item-color',
        title: 'Note color',
        hint: {
            hasHint: true,
            title: 'color pool',
            clickable: true
        }
    });

    input_color.addPlaceholder('green');

    finestra.addContent(input_color);
    finestra.addContent(input_project);

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

    btn_close.addEventListener('click', () => {
        finestra.unrenderModal();
    });

    btn_create.addEventListener('click', async () => {
        const color = input_color.inputComponent.value;
        const project = input_project.inputComponent.value;

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

        const crudResponse = CRUD.createSticky(color, project);

        if (crudResponse.status === 'success') {
            let messageBox;
            const overlay = finestra.component.parentElement;

            messageBox = InformMessageBox('Success!', 'A new sticky has been successfully created!');

            const response = await messageBox.modal(overlay);

            if (response) {
                finestra.unrenderModal(true);
                stickyObject = crudResponse.inputs;

                const stickyNote = StickyNote(stickyObject);
                StickyInterface.addContent(stickyNote);
            };
        };
    });

    /**
     * To edit a todo information
     */
    const editMode = (stickyUpdateInfo, updateInfo) => {
        isEdit = true;
        stickyObject = stickyUpdateInfo;
        // stickyObjectUpdateFunction = updateInfo;

        input_color.inputComponent.value = stickyObject.color;
        input_project.inputComponent.value = stickyObject.project;
    };

    finestra.editMode = editMode;

    return finestra;
};

export default CreateSticky;