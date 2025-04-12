import Button from "../button.js";

/**
 * Simple button is a component that creates a simple button
 * that has no background color and seemingly ressembles a
 * normal text
 * @param {string} buttonAction - Text to display in the button
 * @param {string} buttonId - (Optional) Button's ID
 * @param {boolean} isAlt - (Optional) Boolean value to change the position of the arrow in the button
 * @returns 
 */
function WordButton(buttonAction, buttonId = '', isAlt = false) {
    const template =
        `
        <button type="button" class="comp word-button btn">
            <span class="arrow">&gt;</span>
            <span class="action" id="action-name">
                button
            </span>
        </button>
    `;

    const classList = []

    if (isAlt) classList.add('alt');

    const button = Button({
        id: buttonId,
        classList,
        htmlButtonTemplate: template,
        onCreate: (component) => {
            // Listeners
            component.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            component.addEventListener('mouseenter', () => {
                selectedStatus = true; component.classList.add('selected');
            });

            component.addEventListener('mouseleave', () => {
                selectedStatus = false; component.classList.remove('selected');
            });
        }
    });

    const p_action = button.component.querySelector('.action');
    p_action.textContent = buttonAction;

    return button;
};

export default WordButton;