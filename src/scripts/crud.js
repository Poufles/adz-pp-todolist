import DateHandler from "./date-handler.js";
import StorageHandler from "./storage-handler.js";

const CRUD = function () {
    const account = StorageHandler.GetStorage(true);

    const createTodo = (name, deadline, project, color) => {
        const todos = account.todo;
        const todosLength = todos.length;
        let todoId;

        // CHANGE LATER (ADD PROJECT VERIFICATION) //

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

        if (todosLength === 0) todoId = 0;
        else todoId = todos[todosLength - 1].id + 1

        const objectTemplate = {
            id: todoId,
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

    /**
     * Retrieves all todos.
     * @returns An array of JSON objects containing information about each todos.
     */
    const getTodos = () => {
        const todos = account.todo;
        const todosLength = todos.length;
        const todosArr = [];

        for (let index = 0; index < todosLength; index++) {
            let todo = todos[index];

            todosArr.push(todo);
        };

        return todosArr;
    };

    const updateTodo = (id, name, deadline, project, color, status) => {
        const todos = account.todo;
        const todosLength = todos.length;

        let isSameName;
        let isSameDeadline;
        let isSameProject;
        let isSameColor;
        let originalTodo;

        for (let index = 0; index < todosLength; index++) {
            let todoInTodos = todos[index];
            
            if (todoInTodos.id === id) {
                originalTodo = todoInTodos;
                break;
            };
        };

        if (originalTodo.name === name) isSameName = true;
        if (originalTodo.deadline === deadline) isSameDeadline = true;
        if (originalTodo.project === project) isSameProject = true;
        if (originalTodo.color === color) isSameColor = true;

        if (isSameName && isSameDeadline && isSameProject && isSameColor) {
            return {
                status: 's-invalid',
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

        // Verify date
        if (!isSameDeadline || !DateHandler.isValidateFullTime(deadline)) {
            console.error('Invalid time.');
            
            return {
                status: 't-invalid',
                inputs: undefined
            };
        };

        // CHANGE LATER (ADD PROJECT VERIFICATION) //

        originalTodo.name = name;
        originalTodo.deadline = deadline;
        originalTodo.project = project;
        originalTodo.color = color;

        const objectTemplate = {
            id: originalTodo.id,
            type: originalTodo.type,
            name,
            deadline,
            project,
            color,
            status,
        };

        StorageHandler.UpdateStorage();

        return {
            status: 'success',
            inputs: objectTemplate
        };
    };

    const updateTodoStatus = (id, status) => {
        const todos = account.todo;
        const todosLength = todos.length;

        let todo;

        for (let index = 0; index < todosLength; index++) {
            let todoInTodos = todos[index];
            
            if (todoInTodos.id === id) {
                todo = todoInTodos;
                break;
            };
        };

        todo.status = status;
        StorageHandler.UpdateStorage();
    };

    return {
        createTodo,
        getTodos,
        updateTodo,
        updateTodoStatus
    }
}();

export default CRUD;