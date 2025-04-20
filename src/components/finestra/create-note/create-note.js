import InputBlock from "../../input-block/input-block.js";
import Finestra from "../window.js";

const CreateNote = function(){
    const finestra = Finestra({
        hasActions: true,
        id: 'creator-note',
        windowTitle: 'create note...',
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

    const input_note = InputBlock({
        inputType: 'multi',
        inputId: 'item-note',
        title: 'Write anything',
    });

    input_note.addPlaceholder('my petite note carina');

    finestra.addKeyboardAndStatusTip('creating', 'ctrl + alt + q to go back', 'ctrl + alt + r to reset', 'enter to proceed/confirm');
    finestra.addContent(input_project);
    finestra.addContent(input_color);
    finestra.addContent(input_note);

    return finestra;
}();

// ADD FUNCTIONALITY LATER

export default CreateNote;