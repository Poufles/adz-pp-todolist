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

export default SimpleButton;