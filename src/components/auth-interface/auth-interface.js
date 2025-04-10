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
     */
    const OpenNewGame = () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeStartElements(component, 'Creating account', {
            newTipMessage: true,
            msgArr: [
                '- ctrl + q to cancel/back',
                '- ctrl + x to reset',
                '- enter to proceed/confirm'
            ]
        });

        currentInterface = LoadNewGameElements(component);
    };

    const isNewGameInputComplete = () => {

    };

    /**
     * Creates load game interface
     */
    const OpenLoadGame = () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeStartElements(component, 'Choosing account', {
            newTipMessage: true,
            msgArr: [
                '- ctrl + q to cancel/back',
                '- enter to proceed/confirm'
            ]
        });

        currentInterface = LoadLoadGameElements(component);
    };

    /**
     * Creates setting interface
     */
    const OpenSettings = () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeStartElements(component, 'Configuring settings', {
            newTipMessage: true,
            msgArr: [
                '- ctrl + q to cancel/back',
                '- ctrl + x to return default',
                '- enter to proceed/confirm'
            ]
        });

        currentInterface = LoadSettingsElements(component);
    };

    return {
        render,
        reinitialize,
        OpenNewGame,
        isNewGameInputComplete,
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

    let ctrlHold;

    const inputArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');

    const cont_username = range.createContextualFragment(template);
    const cont_password = range.createContextualFragment(template);
    const cont_conpass = range.createContextualFragment(template);

    cont_interface.id = 'interface';

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
    cont_interface.appendChild(cont_username);
    cont_interface.appendChild(cont_password);
    cont_interface.appendChild(cont_conpass);

    cont_lower.appendChild(cont_interface);
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

    cont_interface.addEventListener('keyup', (e) => {
        if (ctrlHold && e.key === 'Control') {
            ctrlHold = false; return;
        };
    });

    // Listeners to change current input focus
    ArrowKeyListener(cont_interface, inputArr);

    cont_interface.addEventListener('keydown', (e) => {
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
            AuthInterface.reinitialize(); return;
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
    });

    return cont_interface;
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
    
            console.log(acc);
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
    
            console.log(acc);
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
        <div class="setting-block">
            <label class="select-none btn" for="type"><span id="type"></span>:<input type="text" name="" id="type" value="y"></label>
        </div>
        `;
    
    const template_sound =
        `
        <div class="sound-block">
            <label class="select-none btn" for="type">> <span id="type"></span>:<input type="text" name="" id="type" value="y"></label>
        </div>
        `;

    const settingArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');

    const cont_animation = range.createContextualFragment(template);
    const cont_dark = range.createContextualFragment(template);
    const cont_mouse = range.createContextualFragment(template);
    const cont_sound = range.createContextualFragment(template);
    const cont_background = range.createContextualFragment(template_sound);
    const cont_hover = range.createContextualFragment(template_sound);
    const cont_click = range.createContextualFragment(template_sound);

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
 * Initialize certain elements for each start actions
 * @param {HTMLElement} component - Auth Interface component
 * @param {string} statusText - Text for the status message
 * @param {Object} newTipMessage - Boolean
 * @param {Object} msgArr - Array containing texts
 */
function InitializeStartElements(component, statusText, { newTipMessage = false, msgArr = [] }) {
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

    if (newTipMessage) {
        const template =
            `
            <span class="tip" id="tip-1">- ctrl + q to cancel/back</span>
        `;

        const range = document.createRange();
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
};

export default AuthInterface;