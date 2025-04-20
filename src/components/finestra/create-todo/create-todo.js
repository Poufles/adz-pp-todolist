import Finestra from '../window.js';
import InputBlock from '../../input-block/input-block.js';

const CreateTodo = function() {
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

    finestra.addKeyboardAndStatusTip('creating', 'ctrl + alt + q to go back', 'ctrl + alt + r to reset', 'enter to proceed/confirm');
    finestra.addContent(input_name);
    finestra.addContent(input_deadline);
    finestra.addContent(input_project);
    finestra.addContent(input_color);
    finestra.addBottomMessage('experience to earn: 5xp');

    return finestra;
}();

// ADD FUNCTIONALITY LATER

export default CreateTodo;