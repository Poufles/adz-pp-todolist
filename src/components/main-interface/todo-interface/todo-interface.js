import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";

const TodoInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const todoInterface = MainInterface({
        id: 'todos',
        title: 'todos',
        titleCount: account.sticky.length, // CHANGE LATER
        description: 'todos are your tasks to be done. be sure that you will do them in time!',
        buttonText: 'create',
        buttonId: 'create'
    });

    const template_subsection = 
    `
        <div id="sub-section">
            <div class="actions">
                <button type="button" class="btn action selected" id="today">
                    <span id="name">today</span>
                    <span id="count">| 0</span>
                </button>
                <button type="button" class="btn action" id="tomorrow">
                    <span id="name">tomorrow</span>
                    <span id="count">| 0</span>
                </button>
                <button type="button" class="btn action" id="today">
                    <span id="name">upcoming</span>
                    <span id="count">| 0</span>
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

    component.insertBefore(subSection, content);
    cont_top.removeChild(button);
    subSection.appendChild(button);

    return todoInterface;
}();

export default TodoInterface