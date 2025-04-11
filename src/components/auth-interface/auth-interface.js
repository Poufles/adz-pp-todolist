import AccountHandler from '../../scripts/account-handler.js';
import StorageHandler from '../../scripts/storage-handler.js';
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

/**
 * Component module for AuthInterface component
 */
const AuthInterface = function () {
    let currentInterface;
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
        const cont_upper = component.querySelector('#upper')
        const cont_actions = cont_upper.querySelector('#actions');
        const btns_actions = cont_actions.querySelectorAll('button');
        const cont_lower = component.querySelector('#lower')
        const cont_status = cont_lower.querySelector('#status');
        const cont_tip_msg = cont_lower.querySelector('#tip-msg');

        btns_actions.forEach(button => {
            cont_actions.removeChild(button);
        });

        cont_lower.removeChild(cont_tip_msg);
        cont_lower.removeChild(currentInterface);
        cont_status.textContent = 'Waiting input';

        currentInterface = undefined;
    };

    /**
     * Creates new game interface
     * @returns A promise in boolean
     */

    const OpenNewGame = async () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeKeyboardTip(component,
            [
                '- ctrl + alt + q to cancel',
                '- ctrl + alt + r to reset',
                '- enter to proceed/confirm'
            ]
        );

        const buttons = InitializeActionButtons(component, {
            hasCancel: true,
            hasReset: true
        });

        const newGameElement = LoadNewGameElements(component);
        const inputArr = newGameElement.inputArr;

        currentInterface = newGameElement.elementInterface;

        return new Promise((resolve) => {
            let ctrlHold, altHold;
            const arrLength = inputArr.length;

            const btn_cancel = buttons.buttonCancel.render();
            const btn_reset = buttons.buttonReset.render();

            // CHANGE LATER
            btn_cancel.addEventListener('click', () => {
                for (let index = 0; index < arrLength; index++) {
                    const input = inputArr[index];

                    if (input.value) {
                        if (confirm('Are you sure you want to cancel ?')) {
                            reinitialize();
                            resolve(true);

                            return;
                        };

                        return;
                    };
                };

                reinitialize();
                resolve(true);
            });

            // CHANGE LATER
            btn_reset.addEventListener('click', () => {
                for (let index = 0; index < arrLength; index++) {
                    const input = inputArr[index];

                    if (input.value) {
                        if (confirm('Are you sure you want to reset ?')) {
                            inputArr[0].value = '';
                            inputArr[1].value = '';
                            inputArr[2].value = '';

                            return;
                        };

                        break;
                    };
                };
            });

            currentInterface.addEventListener('keyup', (e) => {
                if (ctrlHold && e.key === 'Control') {
                    altHold = false;

                    return;
                };

                if (altHold && e.key === 'Alt') {
                    altHold = false;

                    return;
                };
            });

            currentInterface.addEventListener('keydown', async (e) => {
                let inputInFocus;

                for (let index = 0; index < arrLength; index++) {
                    if (inputArr[index].matches(':focus')) {
                        inputInFocus = index;
                        break;
                    };
                };

                if (e.key === 'Control' && !ctrlHold) {
                    ctrlHold = true; return;
                };

                if (e.key === 'Alt' && !altHold) {
                    altHold = true; return;
                };

                if (e.key.toLowerCase() === 'q' && ctrlHold && altHold) {
                    AuthInterface.reinitialize();
                    resolve(true);

                    return;
                };

                if (e.key.toLowerCase() === 'r' && ctrlHold && altHold) {
                    let hasInput = false;

                    for (let index = 0; index < arrLength; index++) {
                        let input = inputArr[index];

                        if (input.value !== '') {
                            hasInput = true;
                            break;
                        };
                    };

                    if (hasInput) {
                        if (confirm('Reset account creation?')) {
                            for (let input of inputArr) {
                                input.value = '';
                            };

                            inputArr[0].focus();
                            return;
                        };
                    };
                };

                // For input field focus with enter key 
                if (e.key === 'Enter' && inputArr[inputInFocus].value !== '') {
                    let inputComplete = true;

                    // Verifies if all input fields have value
                    for (let index = 0; index < arrLength; index++) {
                        let input = inputArr[index];

                        if (input.value === '') {
                            inputComplete = false;
                            break;
                        };
                    };

                    // Checks if all inputs are complete or if the focus is on the final input field in order to register a new account
                    if (inputComplete || inputInFocus + 1 === arrLength) {
                        const username = inputArr[0].value; // Username
                        const password = inputArr[2].value; // Confirm password

                        if (AccountHandler.register(username, password)) {
                            console.log('Account successfully created !');
                            reinitialize();                        
                            resolve(true); 
                        } else {
                            console.log('Already existing account !');
                        };

                        return;
                    };

                    // Head to the next input field
                    inputArr[inputInFocus + 1].focus();
                    return;
                };
            });
        });
    };

    /**
     * Creates load game interface
     */
    const OpenLoadGame = () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeKeyboardTip(component,
            [
                '- ctrl + alt + q to cancel',
                '- enter to proceed/confirm'
            ]
        );

        const buttons = InitializeActionButtons(component, {
            hasCancel: true
        });

        currentInterface = LoadLoadGameElements(component);
    };

    /**
     * Creates setting interface
     */
    const OpenSettings = () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeKeyboardTip(component,
            [
                '- ctrl + alt + q to cancel',
                '- ctrl + alt + r to return default',
                '- enter to proceed/confirm'
            ]
        );

        const buttons = InitializeActionButtons(component, {
            hasCancel: true,
            hasReset: true
        });

        currentInterface = LoadSettingsElements(component);
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
 * @return The current interface of the component  
 */
function LoadNewGameElements(component) {
    // Change the word type
    const template =
        `
        <div class="block input-block" id="block-type">
            <label class="select-none" for="type">Message:</label>
            <div class="input-box">
                <p class="cursor-default select-none" id="arrow">></p>
                <input type="text" id="type">
            </div>
            <p class="cursor-default select-none" id="block-tip">- Upto 16 characters and no spaces</p>
        </div>
    `;

    const template_visibility =
        `
        <button role="button" tabindex="0" class="btn visibility select-none">&lt;<span id="slash">/</span>&gt;</button>
    `;

    const inputArr = [];
    const visibilityArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');
    const span_status = cont_lower.querySelector('#status');

    const cont_username = range.createContextualFragment(template);
    const cont_password = range.createContextualFragment(template);
    const cont_conpass = range.createContextualFragment(template);

    span_status.textContent = 'Creating account'
    cont_interface.id = 'interface';

    // Username block
    const input_username = DefineBlock(cont_username, 'username', 'How would you like to be called:', '- Upto 16 characters and no spaces');

    // Password block
    const input_password = DefineBlock(cont_password, 'password', 'Enter your desired password:', '- 8 characters or more and no spaces');
    const cont_block_password = cont_password.querySelector('#block-password');
    const cont_input_pass = cont_block_password.querySelector('.input-box');
    const password_visibility_fragment = range.createContextualFragment(template_visibility);
    const btn_password_visibility = password_visibility_fragment.querySelector('button');

    cont_block_password.insertBefore(btn_password_visibility, cont_input_pass);
    input_password.setAttribute('type', 'password');

    // Confirm password block
    const input_conpass = DefineBlock(cont_conpass, 'conpass', 'Please re-enter your password:', '- Please remember your password');
    const cont_block_conpass = cont_conpass.querySelector('#block-conpass');
    const cont_box_conpass = cont_block_conpass.querySelector('.input-box');
    const conpass_visibility_fragment = range.createContextualFragment(template_visibility);
    const btn_conpass_visibility = conpass_visibility_fragment.querySelector('button');

    cont_block_conpass.insertBefore(btn_conpass_visibility, cont_box_conpass);
    input_conpass.setAttribute('type', 'password');

    // Store passwords visibility in array
    visibilityArr.push({
        button: btn_password_visibility,
        input: input_password
    });
    visibilityArr.push({
        button: btn_conpass_visibility,
        input: input_conpass
    });

    // Store input in array (for interactivity)
    inputArr.push(input_username);
    inputArr.push(input_password);
    inputArr.push(input_conpass);

    // Append child
    cont_interface.appendChild(cont_username);
    cont_interface.appendChild(cont_password);
    cont_interface.appendChild(cont_conpass);

    cont_lower.appendChild(cont_interface);
    input_username.focus();

    // Listener for password visibility
    for (let visibility of visibilityArr) {
        const button = visibility.button;
        const input = visibility.input;
        const span = button.querySelector('span#slash');

        button.addEventListener('click', () => {
            if (span.textContent === '/') span.textContent = 'o';
            else span.textContent = '/';

            if (input.type === 'password') input.type = 'text';
            else input.type = 'password';
        });

        button.addEventListener('mousedown', () => {
            span.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            span.style.removeProperty('opacity');
        });
    };

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

    // Listeners to change current input focus
    ArrowKeyListener(cont_interface, inputArr);

    return {
        elementInterface: cont_interface,
        inputArr
    };
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
 * @return The current interface of the component  
 */
function LoadLoadGameElements(component) {
    const template =
        `
        <div role="button" tabindex="0" class="block account-block btn" id="account-0" data-account="0">
            <p class="select-none" id="account-info">
                <span id="username">username</span> | <span id="level">lv1</span> | <span id="date-of-creation">mm/dd/yyyy</span> | tasks: <span id="task-no">0</span> | completed: <span id="completed-task-no">0</span> | due today: <span id="due-today-no"></span>
            </p>
        </div>
    `;

    const accArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');
    const span_status = cont_lower.querySelector('#status');

    span_status.textContent = 'Choosing account';
    cont_interface.id = 'interface';

    // Make a loop here later (CHANGE)
    // Retrieve elements to change
    const account_block = range.createContextualFragment(template);
    const cont_account = account_block.querySelector('.account-block');
    const username = cont_account.querySelector('#username');
    const level = cont_account.querySelector('#level');
    const date_of_creation = cont_account.querySelector('#date-of-creation');
    const tasks = cont_account.querySelector('#task-no');
    const completed = cont_account.querySelector('#completed-task-no');
    const due = cont_account.querySelector('#due-today-no');

    // Change elements' attributes (CHANGE)
    cont_account.dataset.account = `1`;
    cont_account.id = `account-1`;
    username.textContent = `poufsadev`;
    level.textContent = `lv1`;
    date_of_creation.textContent = `03/25/2025`;
    tasks.textContent = `5`;
    completed.textContent = `10`;
    due.textContent = `2`;

    accArr.push(cont_account);
    cont_interface.appendChild(cont_account);

    cont_account.addEventListener('mouseenter', () => {
        for (let index = 0; index < accArr.length; index++) {
            const acc = accArr[index];

            if (acc.classList.contains('clicked')) {
                acc.classList.remove('clicked');
                break;
            };
        };

        cont_account.classList.add('clicked');
        cont_account.focus();
    });

    cont_account.addEventListener('focus', () => {
        for (let index = 0; index < accArr.length; index++) {
            const acc = accArr[index];

            if (acc.classList.contains('clicked')) acc.classList.remove('clicked');
        };

        cont_account.classList.add('clicked');
    });

    cont_account.addEventListener('blur', (e) => {
        cont_account.classList.remove('clicked');
    });

    const acb = range.createContextualFragment(template);
    const a = acb.querySelector('.account-block');
    const b = a.querySelector('#username');
    const c = a.querySelector('#level');
    const d = a.querySelector('#date-of-creation');
    const e = a.querySelector('#task-no');
    const f = a.querySelector('#completed-task-no');
    const g = a.querySelector('#due-today-no');

    a.dataset.account = `2`;
    a.id = `account-2`;
    b.textContent = `userhere`;
    c.textContent = `lv10`;
    d.textContent = `03/31/2025`;
    e.textContent = `2`;
    f.textContent = `57`;
    g.textContent = `1`;

    accArr.push(a);
    cont_interface.appendChild(a);

    a.addEventListener('mouseenter', () => {
        for (let index = 0; index < accArr.length; index++) {
            const acc = accArr[index];

            if (acc.classList.contains('clicked')) {
                acc.classList.remove('clicked');
                break;
            };
        };

        a.classList.add('clicked');
        a.focus();
    });

    a.addEventListener('focus', () => {
        a.classList.add('clicked');
    });

    a.addEventListener('blur', () => {
        a.classList.remove('clicked');
    });
    // Make a loop here later

    cont_lower.appendChild(cont_interface);
    cont_account.focus();

    ArrowKeyListener(cont_interface, accArr);

    return cont_interface;
};

/**
 * Loads the setting elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadSettingsElements(component) {
    // Change "type" to proper block name
    const template =
        `
        <div class="setting-block" id="block-type">
            <label class="select-none btn" for="type"><span id="type"></span>:<input type="text" name="" id="type" value="y"></label>
        </div>
        `;

    const template_sound =
        `
        <div class="sound-block" id="block-type">
            <label class="select-none btn" for="type">> <span id="type"></span>:<input type="text" name="" id="type" value="y"></label>
        </div>
        `;

    const settingArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');
    const span_status = cont_lower.querySelector('#status');

    const cont_animation = range.createContextualFragment(template);
    const cont_dark = range.createContextualFragment(template);
    const cont_mouse = range.createContextualFragment(template);
    const cont_sound = range.createContextualFragment(template);
    const cont_background = range.createContextualFragment(template_sound);
    const cont_hover = range.createContextualFragment(template_sound);
    const cont_click = range.createContextualFragment(template_sound);

    span_status.textContent = 'Configuring settings';
    cont_interface.id = 'interface';

    // Animation block
    const input_animation = DefineSettingBlock(cont_animation, 'animation', 'Animation(y/n)', 'y');

    // Animation block
    const input_dark = DefineSettingBlock(cont_dark, 'dark-mode', 'Dark mode(y/n)', 'y');

    // Animation block
    const input_mouse = DefineSettingBlock(cont_mouse, 'mouse-trail', 'Mouse trail(y/n)', 'y');

    // Animation block
    const input_sound = DefineSettingBlock(cont_sound, 'sounds', 'Sounds(y/n)', 'y');

    // Animation block
    const input_background = DefineSettingBlock(cont_background, 'background', 'Background(y/n)', 'y');

    // Animation block
    const input_hover = DefineSettingBlock(cont_hover, 'hover', 'Hover(y/n)', 'y');

    // Animation block
    const input_click = DefineSettingBlock(cont_click, 'click', 'Click(y/n)', 'y');

    // Insert input in array
    settingArr.push(input_animation);
    settingArr.push(input_dark);
    settingArr.push(input_mouse);
    settingArr.push(input_sound);
    settingArr.push(input_background);
    settingArr.push(input_hover);
    settingArr.push(input_click);

    // Append sound settings 
    const cont_sound_setting = cont_sound.querySelector('.setting-block');

    cont_sound_setting.appendChild(cont_background);
    cont_sound_setting.appendChild(cont_hover);
    cont_sound_setting.appendChild(cont_click);

    // Append block in interface
    cont_interface.appendChild(cont_animation);
    cont_interface.appendChild(cont_dark);
    cont_interface.appendChild(cont_mouse);
    cont_interface.appendChild(cont_sound);

    cont_lower.appendChild(cont_interface);

    // Listeners for input
    for (let setting of settingArr) {
        // Listener when an input receives focus and has a value
        setting.addEventListener('focus', () => {
            const settingLength = setting.value.length;

            requestAnimationFrame(() => {
                setting.setSelectionRange(settingLength, settingLength);
            });
        });
    };

    // Listener for changing input focus
    ArrowKeyListener(cont_interface, settingArr);

    input_animation.focus();

    return cont_interface;
};

/**
 * Defines the setting block
 * @param {HTMLElement} blockTemplate - The block template 
 * @param {String} blockType - The block type
 * @param {String} blockMessage - The text/message for the template to show
 * @param {String} blockDefault - The value to show in the input text;
 */
function DefineSettingBlock(blockTemplate, blockType, blockMessage, blockDefault) {
    const cont_block = blockTemplate.querySelector('div');
    const label = cont_block.querySelector('label');
    const span = cont_block.querySelector('span');
    const input = cont_block.querySelector('input');

    cont_block.id = `block-${blockType}`;
    label.htmlFor = blockType;
    span.textContent = blockMessage;
    input.id = blockType;
    input.value = blockDefault;

    return input;
};

/**
 * Adds arrow key listener for the interface
 * @param {HTMLElement} currentInterface - The current interface
 * @param {Array} objArr - Array inside the interface 
 */
function ArrowKeyListener(currentInterface, objArr) {
    // Listener to change current focus on the interface
    currentInterface.addEventListener('keydown', (e) => {
        let inputInFocus;
        const arrLength = objArr.length;

        for (let index = 0; index < arrLength; index++) {
            if (objArr[index].matches(':focus')) {
                inputInFocus = index;
                break;
            };
        };

        if (e.key === 'ArrowUp') {
            if (inputInFocus - 1 === -1) {
                objArr[arrLength - 1].focus();
                return;
            };

            objArr[inputInFocus - 1].focus();
            return;
        }

        if (e.key === 'ArrowDown') {
            if (inputInFocus + 1 === arrLength) {
                objArr[0].focus();
                return;
            };

            objArr[inputInFocus + 1].focus();
            return;
        }
    });
};

/**
 * Creates action buttons for the Auth Interface component
 * @param {HTMLElement} component - The Auth Interface component
 * @param {Object} options - An object accepting boolean values for the properties: hasCancel and hasReset. 
 * @returns An object containing properties: buttonCancel and buttonReset, which both are part of the SimpleButton object
 */
function InitializeActionButtons(component, { hasCancel = false, hasReset = false } = {}) {
    const cont_actions = component.querySelector('#actions');
    const btn_action_cancel = cont_actions.querySelector('#action-cancel');
    const btn_action_reset = cont_actions.querySelector('#action-reset');

    let btn_cancel, btn_reset;

    // Reset buttons
    if (btn_action_cancel) cont_actions.removeChild(btn_action_cancel);
    if (btn_action_reset) cont_actions.removeChild(btn_action_reset);

    // Create requested buttons
    if (hasCancel) btn_cancel = SimpleButton('Cancel', 'action-cancel');
    if (hasReset) btn_reset = SimpleButton('Reset', 'action-reset');

    // Append buttons
    if (btn_cancel) cont_actions.appendChild(btn_cancel.render());
    if (btn_reset) cont_actions.appendChild(btn_reset.render());

    return {
        buttonCancel: btn_cancel || undefined,
        buttonReset: btn_reset || undefined
    };
};

/**
 * Initialize certain elements for each start actions
 * @param {HTMLElement} component - Auth Interface component
 * @param {Object} msgArr - Array containing texts
 */
function InitializeKeyboardTip(component, msgArr = []) {
    const template =
        `
    <span class="tip" id="tip-1">- ctrl + q to cancel/back</span>
    `;

    const range = document.createRange();
    const cont_lower = component.querySelector('#lower');
    let p_tip_msg = component.querySelector('#tip-msg');

    if (!p_tip_msg) {
        p_tip_msg = document.createElement('p')
        p_tip_msg.classList.add('select-none', 'cursor-default');
        p_tip_msg.setAttribute('id', 'tip-msg');
    } else {
        const tips = p_tip_msg.querySelectorAll('span.tip');

        tips.forEach(tip => {
            p_tip_msg.removeChild(tip);
        });
    };

    for (let index = 0; index < msgArr.length; index++) {
        const fragment = range.createContextualFragment(template);
        const span_tip = fragment.querySelector('span.tip');

        span_tip.id = `tip-${index + 1}`;
        span_tip.textContent = msgArr[index];

        p_tip_msg.appendChild(span_tip);
    };

    cont_lower.appendChild(p_tip_msg);
};

export default AuthInterface;