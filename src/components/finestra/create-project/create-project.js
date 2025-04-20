import InputBlock from "../../input-block/input-block.js";
import Finestra from "../window.js";

const CreateProject = function(){
    const finestra = Finestra({
        hasActions: true,
        id: 'creator-project',
        windowTitle: 'create project...',
        titleButtonText: 'back',
    });

    const input_name = InputBlock({
        inputType: 'multi',
        inputId: 'item-name',
        title: 'Project name',
        hint: {
            hasHint: true,
            title: 'Max characters',
            message: '60 characters'
        }
    });

    input_name.addPlaceholder('POS System for Client X');

    const input_description = InputBlock({
        inputType: 'multi',
        inputId: 'item-description',
        title: 'Description',
        isOptional: true,
        hint: {
            hasHint: true,
            title: 'Max characters',
            message: '120 characters'
        }
    });

    input_description.addPlaceholder('My great description');

    const input_routine = InputBlock({
        inputType: 'one',
        inputId: 'item-routine',
        title: 'Is a routine(y/n)',
        hint: {
            hasHint: true,
            title: 'tip',
            message: 'routines repeat everyday'
        }
    });

    input_routine.addPlaceholder('n');

    const input_color = InputBlock({
        inputType: 'one',
        inputId: 'item-color',
        title: 'Project color',
        hint: {
            hasHint: true,
            title: 'color pool',
            clickable: true
        }
    });

    input_color.addPlaceholder('green');

    finestra.addContent(input_name);
    finestra.addContent(input_description);
    finestra.addContent(input_routine);
    finestra.addContent(input_color);

    return finestra;
}();

// ADD FUNCTIONALITY LATER

export default CreateProject;