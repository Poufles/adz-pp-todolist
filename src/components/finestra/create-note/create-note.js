import InputBlock from "../../input-block/input-block.js";
import Finestra from "../window.js";

const CreateNote = function(){
    const finestra = Finestra({
        hasActions: true,
        id: 'creator-note',
        windowTitle: 'create note...'
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

    const input_note = InputBlock({
        inputType: 'multi',
        inputId: 'item-note',
        title: 'Write anything',
    });

    finestra.addContent(input_project);
    finestra.addContent(input_color);
    finestra.addContent(input_note);

    return finestra;
}();

// ADD FUNCTIONALITY LATER

export default CreateNote;