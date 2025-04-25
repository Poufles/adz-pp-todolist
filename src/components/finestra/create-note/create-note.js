import CRUD from "../../../scripts/crud.js";
import InputBlock from "../../input-block/input-block.js";
import StickyInterface from "../../main-interface/sticky-interface/sticky-interface.js";
import { ConfirmMessageBox, InformMessageBox } from "../../message-box/message-box.js";
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

    function CheckValuesBeforeBack() {
        if (isEdit) {
            let isSameColor, isSameProject;
    
            const todoColor = input_color.inputComponent.value;
            const todoProject = input_project.inputComponent.value;
    
            if (stickyObject.color === todoColor) isSameColor = true;
            if (stickyObject.project === todoProject || (stickyObject.project === 'none' && todoProject === '')) isSameProject = true;
    
            if (isSameColor && isSameProject) {
                finestra.unrenderModal(true); return;
            };
        };

        finestra.unrenderModal();
    };

    btn_reset.addEventListener('click', () => {
        finestra.resetInputs();
    });

    btn_close.addEventListener('click', () => {
        CheckValuesBeforeBack();
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
        
        if (isEdit) {

        let isSameColor, isSameProject;

        if (color === stickyObject.color) isSameColor = true;
        if (project === stickyObject.project) isSameProject = true;

        if (isSameColor && isSameProject) {
            finestra.unrenderModal(true); return;
        };

        finestra.disable();
            const newInputs = {
                id: stickyObject.id,
                desc: stickyObject.desc,
                color,
                project
            };

            const responseCRUD = CRUD.updateSticky(newInputs);

            if (responseCRUD.status === 'success') {
                const overlay = finestra.component.parentElement;

                const messageBox = InformMessageBox('Updated!', 'This sticky has been successfully updated!');
                
                const response = await messageBox.modal(overlay);
                
                if (response) {
                    finestra.unrenderModal(true);

                    stickyObject = responseCRUD.inputs;
                    stickyObjectUpdateFunction(stickyObject);
                };
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
        stickyObjectUpdateFunction = updateInfo;

        input_color.inputComponent.value = stickyObject.color;
        input_project.inputComponent.value = stickyObject.project;
    };

    const checkValuesBeforeBack = function () {
        let isSameColor, isSameProject;

        if (isEdit) {
            const todoColor = input_color.inputComponent.value;
            const todoProject = input_project.inputComponent.value;

            if (stickyObject.color === todoColor) isSameColor = true;
            if (stickyObject.project === todoProject || (stickyObject.project === 'none' && todoProject === '')) isSameProject = true;

            if (isSameColor && isSameProject) {
                finestra.unrenderModal(true); return;
            };
        };

        finestra.unrenderModal();
    };

    finestra.editMode = editMode;
    finestra.checkValuesBeforeBack = checkValuesBeforeBack;

    return finestra;
};

export default CreateSticky;