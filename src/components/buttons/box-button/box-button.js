import Button from "../button.js";

function BoxButton({ text = 'button', id = 'button', isButtonOnly = false } = {}) {
    let template 

    const template_1 =
    `
    <div class="comp box-button select-none">
        <button type="button" class="btn box-button-main" id="box-${id}">
            ${text}
        </button>
        </div>
    `;

    const template_2 = `
        <button type="button" class="btn box-button-main" id="box-${id}">
            ${text}
        </button>
    `;

    if (isButtonOnly) {
        template = template_2;
    } else {
        template = template_1;
    };

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