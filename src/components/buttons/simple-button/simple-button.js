import Button from "../button.js";

/**
 * Simple button is a component that creates a simple button
 * that has no background color and seemingly ressembles a
 * normal text
 * @param {string} text - Text to display in the button
 * @param {string} id - (Optional) Button's ID
 * @returns 
 */
function SimpleButton(text, id = '') {
    const template =
    `
        <button type="button" class="comp btn simple-button">
            <div class="arrow">
                <span>></span>
            </div>
            <p class="text"></p>
        </button>
    `;
    
    const button = Button({
        id,
        htmlButtonTemplate: template
    });

    const p_action = button.component.querySelector('.text');
    p_action.textContent = text;

    return button;
};
// function SimpleButton(buttonName, buttonId = '') {
//     const template =
//     `
//         <button type="button" class="comp btn simple-button">
//             <div class="arrow">
//                 <span>></span>
//             </div>
//             <p class="text"></p>
//         </button>
//     `;
//     // Creating component
//     let component;
//     let checkStatus = false;

//     component = document.createElement('button');

//     component.classList.add('comp', 'btn', 'simple-button');
//     component.setAttribute('id', buttonId);
//     component.innerHTML = template;

//     const p_name = component.querySelector('.text');
//     p_name.textContent = buttonName;

//     // Methods
//     /**
//      * @returns component (Element Node)
//      */
//     const render = () => component;

//     /**
//      * Unrenders component
//      * @param {Node} parentNode - Parent node to unrender the
//      * element from 
//      */
//     const unrender = (parentNode) => { parentNode.removeChild(component) };

//     /**
//      * Retrieves button check status
//      * @returns boolean
//      */
//     const isChecked = () => checkStatus;

//     /**
//      * Checks the button
//      */
//     const check = () => {
//         component.classList.add('clicked');
//         checkStatus = component.classList.contains('clicked');
//     };

//     /**
//      * Unchecks the button
//      */
//     const uncheck = () => {
//         component.classList.remove('clicked');
//         checkStatus = component.classList.contains('clicked');
//     }

//     return {
//         render,
//         unrender,
//         isChecked,
//         check,
//         uncheck
//     };
// };

export default SimpleButton;