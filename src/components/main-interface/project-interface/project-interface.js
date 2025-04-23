import DashboardRuntime from "../../../scripts/dashboard-runtime.js";
import StorageHandler from "../../../scripts/storage-handler.js";
import MainInterface from "../main-interface.js";
import TodoInterface from "../todo-interface/todo-interface.js";

const ProjectInterface = function () {
    const account = StorageHandler.GetStorage(true);

    const projectInterface = MainInterface({
        id: 'projects',
        title: 'projects',
        titleCount: account.project.length, // CHANGE LATER
        description: 'projects or routines are todos compiled and organized in order to complete a bigger todo as a whole. the difference between the two is that projects can only be done once while routines are repeated everyday.',
        buttonText: 'create',
        buttonId: 'create'
    });

    const btn_return = projectInterface.returnButton;
    
    btn_return.addEventListener('click', () => {
        const middle_panel = DashboardRuntime.componentActions.get('middle-panel') 

        projectInterface.animate('leave');

        TodoInterface.render(middle_panel.component); // CHANGE LATER
        
        TodoInterface.animate('enter');
        
        setTimeout(() => {
            projectInterface.unrender();
            TodoInterface.toggleReturnButton(false);
        }, 530);
    });

    return projectInterface;
}();

export default ProjectInterface;