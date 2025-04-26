import AccountHandler from '../../scripts/account-handler.js';
import DateHandler from '../../scripts/date-handler.js';
import StorageHandler from '../../scripts/storage-handler.js';
import SVG from '../../scripts/svg.js';
import SimpleButton from '../buttons/simple-button/simple-button.js';
import { ConfirmMessageBox, InformMessageBox } from '../message-box/message-box.js';

/**
 * Component module for AuthInterface component
 */
const AuthInterface = function () {
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

    let currentInterface;
    let previousInterface;
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
     * Checks if the component has an active modal
     * @returns A boolean value.
     */
    const hasActiveModal = () => {
        let isModalExist = false;

        if (component) {
            let messageBox = component.querySelector('.message-box');

            if (messageBox) {
                isModalExist = true; return isModalExist;
            };

            return isModalExist;
        }

        return isModalExist
    };

    /**
     * Creates new game interface
     * @returns A promise in string: "cancel" or "registered".
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

        async function Cancel() {
            if (hasActiveModal()) return;

            for (let index = 0; index < inputArr.length; index++) {
                const input = inputArr[index];

                if (input.value) {
                    const messageBox = ConfirmMessageBox('Cancel creation?', 'Are you sure you want to cancel?');

                    const isCancel = await messageBox.modal(currentInterface);

                    if (isCancel === 'confirm') {
                        reinitialize();

                        return true;
                    };

                    inputArr[0].focus();
                    return false;
                };
            };

            reinitialize(); return true;
        };

        async function Reset() {
            if (hasActiveModal()) return;

            for (let index = 0; index < inputArr.length; index++) {
                const input = inputArr[index];

                if (input.value) {
                    const messageBox = ConfirmMessageBox('Reset?', 'Are you sure you want to reset?', 'reset');

                    const isReset = await messageBox.modal(currentInterface);

                    if (isReset === 'confirm') {
                        inputArr[0].value = '';
                        inputArr[1].value = '';
                        inputArr[2].value = '';

                        inputArr[0].focus();
                        return;
                    };

                    inputArr[0].focus();
                    return;
                };
            };
        };

        return new Promise((resolve) => {
            let ctrlHold, altHold;
            const arrLength = inputArr.length;

            const btn_cancel = buttons.buttonCancel.render();
            const btn_reset = buttons.buttonReset.render();

            if (btn_cancel) {
                btn_cancel.addEventListener('click', async () => {
                    const isCanceled = await Cancel();

                    if (isCanceled) {
                        resolve('cancel');
                        return;
                    };
                });
            };

            if (btn_reset) {
                btn_reset.addEventListener('click', async () => {
                    await Reset();
                });
            };

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

                if (e.key === 'Backspace') {
                    const input = inputArr[inputInFocus];

                    if (input.value === '' && inputInFocus - 1 < 0) return;

                    if (input.value === '') inputArr[inputInFocus - 1].focus();

                    return;
                }

                if (e.key === 'Control' && !ctrlHold) {
                    ctrlHold = true; return;
                };

                if (e.key === 'Alt' && !altHold) {
                    altHold = true; return;
                };

                if (e.key.toLowerCase() === 'q' && ctrlHold && altHold) {
                    const isCanceled = await Cancel();

                    if (isCanceled) {
                        resolve('cancel');
                        return;
                    };
                };

                if (e.key.toLowerCase() === 'r' && ctrlHold && altHold) {
                    await Reset();
                };

                // For input field focus with enter key 
                if (e.key === 'Enter' && inputArr[inputInFocus].value !== '') {
                    if (hasActiveModal()) return;

                    let username = inputArr[0].value; // Username
                    let password = inputArr[1].value; // Password
                    let conpass = inputArr[2].value; // Confirm password

                    // Verifies username's existance
                    if (AccountHandler.isUsernameExist(username)) {
                        const messageBox = InformMessageBox("Existing username!", "Username already exists. Please choose another username.");

                        messageBox.render(currentInterface);

                        username = '';

                        return;
                    };

                    // Verifies password length
                    if (password !== '' && password.length < 8) {
                        const messageBox = InformMessageBox("Weak password!", "Password should be at least 8 characters");

                        messageBox.render(currentInterface);

                        return;
                    };

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
                        if (password !== conpass) {
                            const messageBox = InformMessageBox("", "Passwords do not match!");

                            messageBox.render(currentInterface);

                            return;
                        };

                        // Checks if the 
                        const isRegistered = await AccountHandler.register(username, password)

                        if (isRegistered) {
                            const messageBox = InformMessageBox('Successful', 'Your account has successfully been created!');

                            const action = await messageBox.modal(currentInterface);

                            if (action === 'close' || action === 'confirm') {
                                reinitialize();
                                resolve('registered');
                            };
                        } else {
                            const messageBox = InformMessageBox("Error!", "An error has occured. Please try again.");

                            messageBox.render(currentInterface);
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

        const loadGameElement = LoadLoadGameElements(component);
        const inputArr = loadGameElement.inputArr;

        currentInterface = loadGameElement.elementInterface;

        async function IsAuthenticated(input) {
            const username = input.querySelector('#username').textContent;

            previousInterface = currentInterface;

            const auth = await OpenAuthenticate(username);

            if (auth === 'cancel') {
                cont_lower.removeChild(currentInterface);
                currentInterface = previousInterface;
                cont_lower.appendChild(currentInterface);
                previousInterface = undefined;

                return;
            };

            if (auth === 'success') {
                reinitialize();
                return 'login';
            };
        };

        return new Promise((resolve) => {
            let ctrlHold, altHold;

            const btn_cancel = buttons.buttonCancel.render();

            if (btn_cancel) {
                btn_cancel.addEventListener('click', () => {
                    if (previousInterface) {
                        cont_lower.removeChild(currentInterface);
                        currentInterface = previousInterface;
                        cont_lower.appendChild(currentInterface);
                        previousInterface = undefined;

                        return;
                    };

                    reinitialize();
                    resolve('cancel');

                    return;
                });
            };

            inputArr.forEach(input => {
                input.addEventListener('click', async () => {
                    const isLoggedIn = await IsAuthenticated(input);

                    if (isLoggedIn === 'login') resolve('login');
                });
            });

            if (currentInterface) {
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
                    if (e.key === 'Control' && !ctrlHold) {
                        ctrlHold = true; return;
                    };

                    if (e.key === 'Alt' && !altHold) {
                        altHold = true; return;
                    };

                    if (e.key.toLowerCase() === 'q' && ctrlHold && altHold) {
                        if (previousInterface) {
                            cont_lower.removeChild(currentInterface);
                            currentInterface = previousInterface;
                            cont_lower.appendChild(currentInterface);
                            previousInterface = undefined;

                            return;
                        };

                        reinitialize();
                        resolve('cancel');

                        return;
                    };

                    if (e.key === 'Enter') {
                        const cont_account = currentInterface.querySelector('.clicked');

                        const isLoggedIn = await IsAuthenticated(cont_account);

                        if (isLoggedIn === 'login') resolve('login');
                    };
                });
            };
        });
    };

    /**
     * Renders authenticate interface when user is logging in
     * @param {string} username - User's username
     */
    function OpenAuthenticate(username) {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        currentInterface = LoadAuthenticate(component);

        return new Promise((resolve) => {
            let ctrlHold, altHold;

            currentInterface.addEventListener('keydown', async (e) => {
                if (e.key === 'Control' && !ctrlHold) {
                    ctrlHold = true; return;
                };

                if (e.key === 'Alt' && !altHold) {
                    altHold = true; return;
                };

                if (e.key.toLowerCase() === 'q' && ctrlHold && altHold) {
                    resolve('cancel');
                    return;
                };

                if (e.key === 'Enter') {
                    const password = component.querySelector('#password').value;

                    const isSuccess = await AccountHandler.login(username, password);

                    if (isSuccess) {
                        resolve('success');
                    } else {
                        const messageBox = InformMessageBox('Error!', 'You have entered a wrong password. Please try again.');

                        messageBox.render(cont_lower);
                    };
                };
            });
        });
    };

    /**
     * Creates setting interface
     */
    const OpenSettings = async () => {
        const cont_lower = component.querySelector('#lower');
        if (currentInterface) cont_lower.removeChild(currentInterface);

        InitializeKeyboardTip(component,
            [
                '- ctrl + alt + q to cancel',
                '- ctrl + alt + r to return default',
                '- enter to save'
            ]
        );

        const buttons = InitializeActionButtons(component, {
            hasCancel: true,
            hasReset: true
        });

        const settingElement = LoadSettingsElements(component);
        const inputArr = settingElement.inputArr;

        currentInterface = settingElement.elementInterface;

        const storage = StorageHandler.GetStorage();
        const setting = storage.app.setting;

        function ResetDefaultSettings() {
            for (let index = 0; index < inputArr.length; index++) {
                const input = inputArr[index];
                input.value = 'y';
            };

            setting.darkmode = true;
            setting.sound.all = true;
            setting.sound.background = true;
            setting.sound.click = true;
            setting.sound.keyboard = true;

            StorageHandler.UpdateStorage({ isRegister: true });
        };

        return new Promise((resolve) => {
            let ctrlHold, altHold;

            const btn_cancel = buttons.buttonCancel.render();
            const btn_reset = buttons.buttonReset.render();

            if (btn_cancel) {
                btn_cancel.addEventListener('click', () => {
                    reinitialize();
                    resolve('cancel');

                    return;
                });
            };

            if (btn_reset) {
                btn_reset.addEventListener('click', () => {
                    ResetDefaultSettings();
                });
            };

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
                if (e.key === 'Control' && !ctrlHold) {
                    ctrlHold = true; return;
                };

                if (e.key === 'Alt' && !altHold) {
                    altHold = true; return;
                };

                if (e.key.toLowerCase() === 'q' && ctrlHold && altHold) {
                    reinitialize();
                    resolve('cancel');

                    return;
                };

                if (e.key.toLowerCase() === 'r' && ctrlHold && altHold) {
                    ResetDefaultSettings(); return;
                };

                if (e.key === 'Enter') {
                    for (let index = 0; index < inputArr.length; index++) {
                        const input = inputArr[index];
                        const inputID = input.id;
                        const inputValue = input.value;

                        if (inputID === 'sound') {
                            setting.sound.all = inputValue === 'y' ? true : false;
                            continue;
                        };

                        if (inputID === 'background') {
                            setting.sound.background = inputValue === 'y' ? true : false;
                            continue;
                        };

                        if (inputID === 'click') {
                            setting.sound.click = inputValue === 'y' ? true : false;
                            continue;
                        };

                        if (inputID === 'keyboard') {
                            setting.sound.keyboard = inputValue === 'y' ? true : false;
                            continue;
                        };

                        setting[input.id] = inputValue === 'y' ? true : false;
                    };

                    StorageHandler.UpdateStorage({ isRegister: true });

                    return;
                };
            });
        });
    };

    return {
        render,
        hasActiveModal,
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

    a_github.appendChild(SVG.githubIcon());
    a_instagram.appendChild(SVG.instagramIcon());
    a_twitter.appendChild(SVG.twitterIcon());

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

        PasswordVisibility(button, input);
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
 * Loads the authenticate elements
 * @param {HTMLElement} component - The AuthInterface component
 * @returns The Authenticate interface
 */
function LoadAuthenticate(component) {
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

    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');
    const span_status = cont_lower.querySelector('#status');

    const cont_password = range.createContextualFragment(template);

    span_status.textContent = 'Authenticating'
    cont_interface.id = 'interface';

    const input_password = DefineBlock(cont_password, 'password', 'Enter your password:',);
    const cont_block_password = cont_password.querySelector('#block-password');
    const cont_input_pass = cont_block_password.querySelector('.input-box');
    const password_visibility_fragment = range.createContextualFragment(template_visibility);
    const btn_password_visibility = password_visibility_fragment.querySelector('button');

    cont_block_password.insertBefore(btn_password_visibility, cont_input_pass);
    input_password.setAttribute('type', 'password');

    cont_interface.appendChild(cont_block_password);
    cont_lower.appendChild(cont_interface);

    input_password.focus();

    PasswordVisibility(btn_password_visibility, input_password);

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
 * Adds visibility option for the password
 * @param {HTMLElement} button - The button element for password visibility.
 * @param {HTMLElement} input - The input element of the password. 
 */
function PasswordVisibility(button, input) {
    const span = button.querySelector('span#slash');

    button.addEventListener('click', () => {
        if (span.textContent === '/') span.textContent = 'o';
        else span.textContent = '/';

        if (input.type === 'password') {
            input.type = 'text';
            input.focus();
        } else {
            input.type = 'password';
            input.focus();
        }
    });

    button.addEventListener('mousedown', () => {
        span.style.opacity = '1';
    });

    button.addEventListener('mouseleave', () => {
        span.style.removeProperty('opacity');
    });
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
    const storage = StorageHandler.GetStorage();
    const accountStorage = storage.app.account;
    const range = document.createRange();
    const cont_lower = component.querySelector('#lower');
    const cont_interface = document.createElement('div');
    const span_status = cont_lower.querySelector('#status');

    cont_interface.id = 'interface';
    span_status.textContent = 'Choosing account';

    if (accountStorage.length === 0) {
        const messageBox = InformMessageBox('No accounts!', 'Unfortunately, there were no accounts found.');
        const cont_msgBox = messageBox.render();

        messageBox.render(cont_interface);
        cont_interface.appendChild(cont_msgBox);
        cont_lower.appendChild(cont_interface);

        return {
            elementInterface: cont_interface,
            inputArr: accArr
        };
    };

    // Make a loop here later (CHANGE)
    for (let index = 0; index < accountStorage.length; index++) {
        const account = accountStorage[index];

        // Retrieve elements to change
        const account_block = range.createContextualFragment(template);
        const cont_account = account_block.querySelector('.account-block');
        const username = cont_account.querySelector('#username');
        const level = cont_account.querySelector('#level');
        const date_of_creation = cont_account.querySelector('#date-of-creation');
        const tasks = cont_account.querySelector('#task-no');
        const completed = cont_account.querySelector('#completed-task-no');
        const due = cont_account.querySelector('#due-today-no');

        let dueCount = 0;
        let accountTodos = account.todo.length;

        for (let index = 0; index < accountTodos; index++) {
            const accountTodo = account.todo[index];
            const isDueToday = DateHandler.timeDifference(accountTodo.deadline);

            if (isDueToday) dueCount++;
        };

        // Change elements' attributes (CHANGE)
        cont_account.dataset.account = index;
        cont_account.id = `account-${index}`;
        username.textContent = account.username;
        level.textContent = account.level;
        date_of_creation.textContent = account.dateofcreation;
        tasks.textContent = accountTodos;
        completed.textContent = account.completedcount;
        due.textContent = accountTodos;

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
    };

    cont_lower.appendChild(cont_interface);

    if (cont_interface.firstChild) cont_interface.firstChild.focus();

    ArrowKeyListener(cont_interface, accArr);

    return {
        elementInterface: cont_interface,
        inputArr: accArr
    };
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

    const setting = StorageHandler.GetStorage().app.setting;
    const settingArr = [];
    const range = document.createRange();
    const cont_interface = document.createElement('div');
    const cont_lower = component.querySelector('#lower');
    const span_status = cont_lower.querySelector('#status');

    const cont_dark = range.createContextualFragment(template);
    const cont_sound = range.createContextualFragment(template);
    const cont_background = range.createContextualFragment(template_sound);
    const cont_hover = range.createContextualFragment(template_sound);
    const cont_click = range.createContextualFragment(template_sound);

    span_status.textContent = 'Configuring settings';
    cont_interface.id = 'interface';

    // Dark mode block
    const input_dark = DefineSettingBlock(cont_dark, 'darkmode', 'Dark mode(y/n)', setting.darkmode);

    // Sound block
    const input_sound = DefineSettingBlock(cont_sound, 'sound', 'Sounds(y/n)', setting.sound.all);

    // Background sound block
    const input_background = DefineSettingBlock(cont_background, 'background', 'Background(y/n)', setting.sound.background);

    // Keyboard sound block
    const input_keyboard = DefineSettingBlock(cont_hover, 'keyboard', 'Keyboard(y/n)', setting.sound.keyboard);

    // Mouse click sound block
    const input_click = DefineSettingBlock(cont_click, 'click', 'Click(y/n)', setting.sound.click);

    // Insert input in array
    settingArr.push(input_dark);
    settingArr.push(input_sound);
    settingArr.push(input_background);
    settingArr.push(input_keyboard);
    settingArr.push(input_click);

    // Append sound settings 
    const cont_sound_setting = cont_sound.querySelector('.setting-block');

    cont_sound_setting.appendChild(cont_background);
    cont_sound_setting.appendChild(cont_hover);
    cont_sound_setting.appendChild(cont_click);

    // Append block in interface
    cont_interface.appendChild(cont_dark);
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

    for (let setting of settingArr) {
        setting.addEventListener('keydown', (e) => {
            e.preventDefault();

            if (e.key.toLowerCase() === 'y') {
                setting.value = 'y'; return;
            };

            if (e.key.toLowerCase() === 'n') {
                setting.value = 'n'; return;
            };

            if (e.key === 'Backspace') {
                setting.value = setting.value === 'y' ? 'n' : 'y';
                return;
            };
        });
    };

    // Listener for changing input focus
    ArrowKeyListener(cont_interface, settingArr);

    input_dark.focus();

    return {
        elementInterface: cont_interface,
        inputArr: settingArr
    };
};

/**
 * Defines the setting block
 * @param {HTMLElement} blockTemplate - The block template 
 * @param {String} blockType - The block type
 * @param {String} blockMessage - The text/message for the template to show
 * @param {Boolean} blockValue - The value of the block to be translated into y or n
 */
function DefineSettingBlock(blockTemplate, blockType, blockMessage, blockValue) {
    const cont_block = blockTemplate.querySelector('div');
    const label = cont_block.querySelector('label');
    const span = cont_block.querySelector('span');
    const input = cont_block.querySelector('input');

    cont_block.id = `block-${blockType}`;
    label.htmlFor = blockType;
    span.textContent = blockMessage;
    input.id = blockType;
    input.value = blockValue ? 'y' : 'n';

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