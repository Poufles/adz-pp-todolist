export default function Button({ id, classList = [], htmlButtonTemplate, onCreate }) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(htmlButtonTemplate);
    const component = fragment.firstElementChild;

    if (id) component.id = id;
    
    classList.forEach(cls => component.classList.add(cls));

    let checkStatus = false;

    const render = () => component;

    const unrender = parentNode => parentNode.removeChild(component);

    const isChecked = () => checkStatus;

    const check = () => {
        component.classList.add('clicked');
        checkStatus = true;
    };

    const uncheck = () => {
        component.classList.remove('clicked');
        checkStatus = false;
    };

    if (onCreate) onCreate(component); 

    return {
        render,
        unrender,
        isChecked,
        check,
        uncheck,
        component 
    };
};