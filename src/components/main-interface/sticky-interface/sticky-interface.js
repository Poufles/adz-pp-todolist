import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";
import TodoInterface from "../todo-interface/todo-interface.js";

const StickyInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const stickyInterface = MainInterface({
        id: 'stickies',
        title: 'stickies',
        titleCount: account.sticky.length, // CHANGE LATER
        description: 'stickies are sticky notes. may it be random gibberish or lists, write any!',
        buttonText: 'create',
        buttonId: 'create'
    });

    const btn_return = stickyInterface.returnButton;
    
    btn_return.addEventListener('click', () => {
        const middle_panel = DashboardRuntime.componentActions.get('middle-panel') 

        StickyInterface.animate('leave');

        TodoInterface.render(middle_panel.component); // CHANGE LATER
        TodoInterface.animate('enter');
        
        setTimeout(() => {
            stickyInterface.unrender();
            TodoInterface.toggleReturnButton(false);
        }, 530);
    });

    return stickyInterface;
}();

export default StickyInterface;