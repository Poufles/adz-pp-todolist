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

    return button;
};

export default BoxButton;