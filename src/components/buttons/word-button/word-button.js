import Button from "../button.js";

/**
 * Simple button is a component that creates a simple button
 * that has no background color and seemingly ressembles a
 * normal text
 * @param {string} text - Text to display in the button
 * @param {string} id - (Optional) Button's ID
 * @param {boolean} isAlt - (Optional) Boolean value to change the position of the arrow in the button
 * @returns 
 */
// function WordButton(text, id = '', cls = [], isAlt = false) {
function WordButton({ text, id = '', cls = [], isAlt = false } = {}) {
    const template =
        `
        <button type="button" class="comp word-button btn select-none">
            <span class="arrow">&gt;</span>
            <span class="action" id="">
                button
            </span>
        </button>
    `;

    const templateAlt =
        `
        <button type="button" class="comp word-button btn select-none">
            <span class="action" id="">
            button
            </span>
            <span class="arrow">&lt;</span>
        </button>
    `;

    let htmlButtonTemplate;
    const classList = []

    if (isAlt) {
        htmlButtonTemplate = templateAlt
        classList.push('alt')
    } else {
        htmlButtonTemplate = template;
    }

    cls.forEach(item => classList.push(item));

    const button = Button({
        id,
        classList,
        htmlButtonTemplate,
        onCreate: (component, selectedStatus) => {
            // Listeners
            component.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            component.addEventListener('mouseenter', () => {
                selectedStatus = true;
                component.classList.add('selected');
            });

            component.addEventListener('mouseleave', () => {
                selectedStatus = false;
                component.classList.remove('selected');
            });
        }
    });

    const p_action = button.component.querySelector('.action');
    p_action.textContent = text;

    return button;
};

export default WordButton;