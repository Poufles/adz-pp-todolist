/**
 * Creates base button
 * @param {Object} options - An object that takes different parameters depending on what a certain button requires. 
 * @returns A Button object
 */
export default function Button({ id, classList = [], htmlButtonTemplate, onCreate } = {}) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(htmlButtonTemplate);
    const component = fragment.firstElementChild;

    if (id) component.id = id;
    
    classList.forEach(cls => component.classList.add(cls));

    let checkStatus = false;
    let selectedStatus = false;

    const render = () => component;

    const unrender = parentNode => parentNode.removeChild(component);

    const isChecked = () => checkStatus;

    const isSelected = () => selectedStatus;

    const check = () => {
        component.classList.add('clicked');
        checkStatus = true;
    };

    const uncheck = () => {
        component.classList.remove('clicked');
        checkStatus = false;
    };

    const select = () => {
        selectedStatus = true;
        component.classList.add('selected');
    };
    const deselect = () => {
        selectedStatus = false;
        component.classList.remove('selected');
    };

    if (onCreate) onCreate(component, selectedStatus); 

    return {
        render,
        unrender,
        isChecked,
        isSelected,
        check,
        uncheck,
        select,
        deselect,
        component 
    };
};

// Note:
// Trying to understand how to deal with compositions.
// ChatGPT helped me on this one.