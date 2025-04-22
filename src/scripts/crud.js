import DateHandler from "./date-handler.js";
import StorageHandler from "./storage-handler.js";

const CRUD = function () {
    const account = StorageHandler.GetStorage(true);

    const createTodo = (name, deadline, project, color) => {
        const todos = account.todo;
        const todosLength = todos.length;

        // Verify date
        if (!DateHandler.isValidateFullTime(deadline)) {
            console.error('Invalid time.');
            
            return {
                status: 't-invalid',
                inputs: undefined
            };
        };
        
        // Verify if todo already exists
        if (todosLength !== 0) {
            for (let index = 0; index < todosLength; index++) {
                let todo = todos[index];
                if (todo.name === name) {
                    console.error('Name already exists.');

                    return {
                        status: 'n-invalid',
                        inputs: undefined
                    };
                };
            };
        };

        const objectTemplate = {
            type: 'todo',
            name,
            deadline,
            project: project || 'none',
            color,
            status: false,
        };

        todos.push(objectTemplate);
        StorageHandler.UpdateStorage();

        return {
            status: 'success',
            inputs: objectTemplate
        };
    };

    return {
        createTodo,
    }
}();

export default CRUD;