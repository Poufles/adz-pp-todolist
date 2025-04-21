import Button from "../button.js";

function BoxButton({ text = 'button', id = 'button' } = {}) {
    const template =
    `
    <div class="comp box-button select-none">
        <button type="button" class="btn" id="box-${id}">
            ${text}
        </button>
    </div>
    `;

    const button = Button({
        id,
        htmlButtonTemplate: template
    });

    const buttonComponent = button.component;

    buttonComponent.addEventListener('mousedown', (e) => {
        buttonComponent.classList.add('click-hold');
    });

    buttonComponent.addEventListener('mouseup', (e) => {
        buttonComponent.classList.remove('click-hold');
    });

    buttonComponent.addEventListener('mouseleave', (e) => {
        buttonComponent.classList.remove('click-hold');
    });

    return button;
};

export default BoxButton;