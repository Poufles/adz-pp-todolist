import SVG from '../../scripts/svg.js';
import SimpleButton from '../buttons/simple-button/simple-button.js';

const template =
    `
        <div id="upper">
            <div id="actions">

            </div>
            <div id="socmed">
                <p class="cursor-default select-none" id="author">poufsadev</p>
            </div>
        </div>
        <div id="lower">
            <p class="cursor-default select-none" id="status-msg">
                Status: <span id="status">Waiting input</span>...
            </p>
        </div>
`;

const template_tip_msg =
    `
    <span class="tip" id="tip-1">- ctrl + q to cancel/back</span>
    <span class="tip" id="tip-2">- ctrl + x to reset</span>
    <span class="tip" id="tip-3">- enter to proceed/confirm</span>
`;

/**
 * Component module for AuthInterface component
 */
const AuthInterface = function () {
    // Creating component
    const component = document.createElement('section');

    component.classList.add('comp', 'auth-interface');
    component.innerHTML = template;

    LoadComponentElements(component);

    /**
     * Renders the component
     * @returns the component
     */
    const render = () => component;

    /**
     * Reinitalize the whole component
     */
    const reinitialize = () => {

    };

    /**
     * Creates new game interface
     */
    const OpenNewGame = () => {
        InitializeStartElements(component, 'Creating account');
        LoadNewGameElements(component);
    };

    /**
     * Creates load game interface
     */
    const OpenLoadGame = () => {
        InitializeStartElements(component, 'Choosing account');
        LoadLoadGameElements(component);
    };

    /**
     * Creates setting interface
     */
    const OpenSettings = () => {
        InitializeStartElements(component, 'Configuring settings');
        LoadSettingsElements(component);
    };

    return {
        render,
        reinitialize,
        OpenNewGame,
        OpenLoadGame,
        OpenSettings
    }
}();

/**
 * Loads the elements for the component
 * @param {HTMLElement} component - AuthInterface component
 */
function LoadComponentElements(component) {
    const cont_socmed = component.querySelector('#socmed');
    const a_github = document.createElement('a');
    const a_instagram = document.createElement('a');
    const a_twitter = document.createElement('a');

    a_github.target = 'blank';
    a_instagram.target = 'blank';
    a_twitter.target = 'blank';

    a_github.href = 'https://github.com/Poufles';
    a_instagram.href = 'https://www.instagram.com/poufsadev/';
    a_twitter.href = 'https://x.com/Vqliant';

    a_github.appendChild(SVG.i_github);
    a_instagram.appendChild(SVG.i_instagram);
    a_twitter.appendChild(SVG.i_twitter);

    cont_socmed.appendChild(a_github);
    cont_socmed.appendChild(a_instagram);
    cont_socmed.appendChild(a_twitter);
};

/**
 * Loads the new game elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadNewGameElements(component) {
    // Change the word type
    const template =
    `
        <div class="input-block" id="block-type">
            <label class="select-none" for="type">Message:</label>
            <div class="input-box">
                <p class="cursor-default select-none" id="arrow">></p>
                <input type="text" id="type">
            </div>
            <p class="cursor-default select-none" id="block-tip">- Upto 16 characters and no spaces</p>
        </div>
    `;

    let ctrlHold;

    const range = document.createRange();
    const inputArr = [];
    const cont_lower = component.querySelector('#lower');
    const cont_username = range.createContextualFragment(template);
    const cont_password = range.createContextualFragment(template);
    const cont_conpass = range.createContextualFragment(template);

    // Username block
    const input_username = DefineBlock(cont_username, 'username', 'How would you like to be called:', '- Upto 16 characters and no spaces');
    
    // Password block
    const input_password = DefineBlock(cont_password, 'password', 'Enter your desired password:', '- 8 characters or more and no spaces')
    input_password.setAttribute('type', 'password');
    
    // Confirm password block
    const input_conpass = DefineBlock(cont_conpass, 'conpass', 'Please re-enter your password:', '- Please remember your password');
    input_conpass.setAttribute('type', 'password');
    
    // Store input in array (for interactivity)
    inputArr.push(input_username);
    inputArr.push(input_password);
    inputArr.push(input_conpass);

    // Append child
    cont_lower.appendChild(cont_username);
    cont_lower.appendChild(cont_password);
    cont_lower.appendChild(cont_conpass);

    input_username.focus();

    // Listeners for input
    for (let input of inputArr) {
        // Listener when an input receives focus and has a value
        input.addEventListener('focus', () => {
            const inputLength = input.value.length;

            requestAnimationFrame(() => {
                input.setSelectionRange(inputLength, inputLength);
            });
        });
    };

    // Listener for username to prevent max character
    input_username.addEventListener('input', (e) => {
        const input_value = input_username.value;
        const inputLength = input_value.length;

        if (inputLength > 16 || input_value[inputLength - 1] === ' ') input_username.value = input_value.slice(0, inputLength - 1);
    });

    // Listener to change current input focus
    component.addEventListener('keydown', (e) => {
        let inputInFocus;
        const arrLength = inputArr.length;

        for (let index = 0; index < arrLength; index++) {
            if (inputArr[index].matches(':focus')) {
                inputInFocus = index;
                break;
            };
        };

        if (e.key === 'Control' && !ctrlHold) {
            ctrlHold = true; return;
        };

        if (e.key.toLowerCase() === 'q' && ctrlHold) {
            console.log('Cance;');
            return;
        };

        if (e.key.toLowerCase() === 'x' && ctrlHold) {
            for (let input of inputArr) {
                console.log(input);
                input.value = '';
            };

            inputArr[0].focus();
            return;
        };

        if (e.key === 'Enter' && inputArr[inputInFocus].value !== '') {
            if (inputInFocus + 1 === arrLength) {
                return;
            };

            inputArr[inputInFocus + 1].focus();
            return;
        };

        if (e.key === 'ArrowUp') {
            if (inputInFocus - 1 === -1) {
                inputArr[arrLength - 1].focus();
                return;
            };

            inputArr[inputInFocus - 1].focus();
            return;
        }

        if (e.key === 'ArrowDown') {
            if (inputInFocus + 1 === arrLength) {
                inputArr[0].focus();
                return;
            };

            inputArr[inputInFocus + 1].focus();
            return;
        }
    });
};

/**
 * Defines the block for the new game elements
 * @param {HTMLElement} blockTemplate - The block template to modify 
 * @param {String} blockType - Block type for the template
 * @param {String} blockMessage - The text/message to be shown
 * @param {String} blockTip - (Optional) The text tip to be shown
 * @returns The input element inside the template
 */
function DefineBlock(blockTemplate, blockType, blockMessage, blockTip = '') {
    const cont_block = blockTemplate.querySelector('#block-type');
    const label = cont_block.querySelector('label');
    const input = cont_block.querySelector('input');
    const tip = cont_block.querySelector('#block-tip');

    cont_block.id = `block-${blockType}`;
    label.htmlFor = blockType;
    label.textContent = blockMessage;
    input.id = blockType;
    tip.textContent = blockTip;

    return input;
};

/**
 * Loads the load game elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadLoadGameElements(component) {

};

/**
 * Loads the setting elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadSettingsElements(component) {

};

/**
 * Initialize certain elements for each start actions
 * @param {HTMLElement} component - Auth Interface component
 * @param {string} statusText - Text for the status message
 */
function InitializeStartElements(component, statusText) {
    const cont_actions = component.querySelector('#actions');
    const btn_action_cancel = cont_actions.querySelector('#action-cancel');
    const btn_action_reset = cont_actions.querySelector('#action-reset');

    if (btn_action_cancel) cont_actions.removeChild(btn_action_cancel);
    if (btn_action_reset) cont_actions.removeChild(btn_action_reset);

    const btn_cancel = SimpleButton('Cancel', 'action-cancel');
    const btn_reset = SimpleButton('Reset', 'action-reset');

    const span_status = component.querySelector('#status');
    span_status.textContent = statusText;

    cont_actions.appendChild(btn_cancel.render());
    cont_actions.appendChild(btn_reset.render());

    const cont_lower = component.querySelector('#lower');
    const cont_tip_msg = cont_lower.querySelector('#tip-msg');

    if (!cont_tip_msg) {
        const p_tip_msg = document.createElement('p');

        p_tip_msg.innerHTML = template_tip_msg;
        p_tip_msg.classList.add('select-none', 'cursor-default');
        p_tip_msg.setAttribute('id', 'tip-msg');
        cont_lower.appendChild(p_tip_msg);
    };
};

export default AuthInterface;