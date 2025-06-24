import './FormTerminal.css';

import DateHandler from '../../../scripts/date-handler.js';
import StorageHandler from '../../../scripts/storage-handler.js';
import Auth from '../../../templates/auth/auth.js';

const FormTerminal = function () {
    const template = `
    <div class="component form terminal default">
        <div class="terminal-wrapper">
            <p class="text" id="status">
                Status: <span id="message">Waiting for input...</span>
            </p>
            <div id="tip-message">
                <p class="text" id="title-tip">
                </p>
                <p id="desc-tip">
                </p>
            </div>
            <form action="">
            </form>
            <div id="actions">
                <button type="button" class="button" id="reset">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button type="button" class="button" id="confirm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12L8.94975 16.9497L19.5572 6.34326" stroke="white" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button type="button" class="button" id="cancel">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="white" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.component');
    const actions = component.querySelector('#actions');
    const btn_reset = actions.querySelector('#reset');
    const btn_confirm = actions.querySelector('#confirm');
    const btn_cancel = actions.querySelector('#cancel');
    const actionButtons = {
        reset: btn_reset,
        confirm: btn_confirm,
        cancel: btn_cancel
    };

    let terminalFormStatus = -1;
    let preLoginAccount;

    /**
     * Renders the component to a given parent.
     * @param {HTMLElement} parent 
     */
    const render = (parent) => {
        if (parent && !parent.contains(component)) parent.appendChild(component);
        else console.error('Parent doesn\'t exist or component already attached.');
    };

    /**
     * Unrenders the component.
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent) parent.removeChild(component);
        else console.error(`Parent or component doesn't exist.`);
    };

    /**
     * Checks the current state
     * @returns A boolean value.
     */
    const isDefaultState = () => {
        if (terminalFormStatus === -1) return true;
        return false;
    };

    /**
     * Change form state to default.
     */
    const hideActions = () => {
        const buttons = actions.querySelectorAll('button');

        buttons.forEach(button => {
            button.disabled = true;
        });

        actions.classList.remove('show')
    };

    /**
     * Change form state to action.
    */
    const showActions = () => {
        const buttons = actions.querySelectorAll('button');

        buttons.forEach(button => {
            button.disabled = false;
        });

        actions.classList.add('show')
    };

    /**
     * Changes what type of form to show.
     * @param {Number} type 
     */
    const terminalForm = (type) => {
        if (terminalFormStatus === type) return;

        terminalFormStatus = type;

        CancelLoginAppearanceReset();

        if (type === 1) {
            NewAccountForm();
            showActions();
        } else if (type === 2) {
            LoadAccountForm();
            hideActions();
        } else if (type === 3) {
            SettingsForm();
            showActions();
        } else {
            DefaultForm();
            hideActions();
        };
    };

    /**
     * Resets the current form.
     */
    const resetForm = () => {
        if (terminalFormStatus === 1) NewAccountForm();
        else if (terminalFormStatus === 2) LoadAccountForm();
        else if (terminalFormStatus === 3) SettingsForm()
        else LoginForm(preLoginAccount);
    };

    /**
     * Confirms the current form.
     */
    const confirmForm = () => {
        const form = component.querySelector('form');

        if (terminalFormStatus === 1) {
            ValidateNewAccountForm(form);
        };
    };

    return {
        component,
        actionButtons,
        get terminalFormStatus() { return terminalFormStatus },
        set terminalFormStatus(value) { terminalFormStatus = value; },
        get preLoginAccount() { return preLoginAccount },
        set preLoginAccount(value) { preLoginAccount = value },
        render,
        unrender,
        isDefaultState,
        hideActions,
        showActions,
        terminalForm,
        resetForm,
        confirmForm
    };
}();

/**
 * Changes the terminal into default.
 */
function DefaultForm() {
    SetTerminalText(
        'Waiting for input...',
        '',
        '',
    );

    const form = FormTerminal.component.querySelector('form');
    form.innerHTML = '';
};

/**
 * Changes the terminal into a new account form.
 */
function NewAccountForm() {
    const template = `
                <div class="input-block" id="username-block">
                    <div class="input-hint">
                        <p class="hint-text">Username</p>
                        <div class="hint-error">| <span class="error"></span></div>
                    </div>
                    <label for="username">
                        <span>>></span>
                        <input class="text" type="text" name="" id="username">
                    </label>
                </div>
                <div class="input-block" id="password-block">
                    <div class="input-hint">
                        <p class="hint-text">Password</p>
                        <button class="button reset" type="button" id="hide-pass">&lt;/&gt;</button>
                        <div class="hint-error">| <span class="error"></span></div>
                    </div>
                    <label for="password">
                        <span>>></span>
                        <input class="text" type="password" name="" id="password">
                    </label>
                </div>
                <div class="input-block" id="conpass-block">
                    <div class="input-hint">
                        <p class="hint-text">Confirm Password</p>
                        <button class="button reset" type="button" id="hide-conpass">&lt;/&gt;</button>
                        <div class="hint-error">| <span class="error"></span></div>
                    </div>
                    <label for="conpass">
                        <span>>></span>
                        <input class="text" type="password" name="" id="conpass">
                    </label>
                </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const usernameBlock = fragment.querySelector('#username-block');
    const passwordBlock = fragment.querySelector('#password-block');
    const conpassBlock = fragment.querySelector('#conpass-block');

    SetTerminalText(
        'Creating new account...',
        'Welcome!',
        'The only rule in creating an account is that your password must be at least 10 characters long.',
    );

    const form = FormTerminal.component.querySelector('form');
    form.innerHTML = '';
    form.appendChild(usernameBlock);

    const inputUsername = usernameBlock.querySelector('input');
    const inputPassword = passwordBlock.querySelector('input');
    const inputConpass = conpassBlock.querySelector('input');
    const btnHidePass = passwordBlock.querySelector('button');
    const btnHideConpass = conpassBlock.querySelector('button');
    const hintTextUsername = usernameBlock.querySelector('.hint-text');
    const hintTextPassword = passwordBlock.querySelector('.hint-text');
    const hintTextConpass = conpassBlock.querySelector('.hint-text');

    // INITIAL FOCUS
    inputUsername.focus();

    // VERIFICATIONS
    // add verification later for usernames

    // LISTENERS //
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    inputUsername.addEventListener('keydown', (e) => {
        if (inputUsername.value !== '' && !form.contains(inputPassword) && e.key === 'Enter') {
            form.appendChild(passwordBlock);
            inputPassword.focus();

            return;
        };

        if (inputUsername.value !== '' && form.contains(inputPassword) && e.key === 'Enter') {
            inputPassword.focus();
        };
    });

    inputUsername.addEventListener('focus', (e) => {
        e.stopPropagation();

        if (form.contains(passwordBlock) && !form.contains(conpassBlock) && inputPassword.value === '') form.removeChild(passwordBlock);
    });

    inputPassword.addEventListener('keydown', (e) => {
        if (inputPassword.value !== '' && !form.contains(conpassBlock) && e.key === 'Enter') {
            form.appendChild(conpassBlock);
            inputConpass.focus();
            return;
        };

        if (inputPassword.value !== '' && form.contains(conpassBlock) && e.key === 'Enter') {
            inputConpass.focus();
            return;
        };

        let hintError = passwordBlock.querySelector('.hint-error');
        let hintErrorMessage = hintError.querySelector('.error');

        if (hintError.classList.contains('show')) {
            hintError.classList.remove('show');
        };

        if (inputPassword.value === '' && e.key === 'Enter') {
            hintErrorMessage.textContent = 'Required information!';
            hintError.classList.add('show');

            return;
        };
    });

    inputPassword.addEventListener('focus', (e) => {
        const hintError = passwordBlock.querySelector('.hint-error');

        if (hintError.classList.contains('show')) hintError.classList.remove('show');

        if (form.contains(conpassBlock) && inputConpass.value === '') form.removeChild(conpassBlock);
    });

    inputConpass.addEventListener('focus', (e) => {
        const hintError = conpassBlock.querySelector('.hint-error');

        if (hintError.classList.contains('show')) hintError.classList.remove('show');
    });

    inputConpass.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') ValidateNewAccountForm(form);
    });

    btnHidePass.addEventListener('click', (e) => {
        e.stopPropagation();

        HidePasswordToggle(btnHidePass, inputPassword);
    });

    btnHideConpass.addEventListener('click', (e) => {
        e.stopPropagation();

        HidePasswordToggle(btnHideConpass, inputConpass);
    });

    hintTextUsername.addEventListener('click', (e) => {
        e.stopPropagation();

        inputUsername.focus();
    });

    hintTextPassword.addEventListener('click', (e) => {
        e.stopPropagation();

        inputPassword.focus();
    });

    hintTextConpass.addEventListener('click', (e) => {
        e.stopPropagation();

        inputConpass.focus();
    });
};

/**
 * Toggles the password visibility.
 * @param {HTMLButtonElement} button 
 * @param {HTMLInputElement} input 
 */
function HidePasswordToggle(button, input) {
    if (input.type === 'password') {
        button.textContent = '<o>';
        input.type = 'text';
    } else {
        button.textContent = '</>';
        input.type = 'password';
    };

    input.focus();
};

/**
 * Validates the new account form.
 * @param {HTMLFormElement} form 
 */
function ValidateNewAccountForm(form) {
    // Load storage
    const localStore = StorageHandler.getLocalStorage();
    const accounts = localStore.app.accounts;

    // Load form blocks and validate
    const usernameBlock = form.querySelector('#username-block');
    let passwordBlock = form.querySelector('#password-block');
    let conpassBlock = form.querySelector('#conpass-block');

    // Validate existing username
    for (let iter = 0; iter < accounts.length; iter++) {
        const account = accounts[iter];
        const username = usernameBlock.querySelector('input');

        if (account.username === username.value) {
            console.error('Username already exists!');
            return;
        };
    };

    // Change the console.error here in a component later
    if (!passwordBlock) {
        console.error('Missing information required!');
        return;
    };

    // Change the console.error here in a component later
    if (!conpassBlock) {
        console.error('Missing information required!');
        return;
    };

    // Get passwords
    const password = passwordBlock.querySelector('input');
    const conpass = conpassBlock.querySelector('input');

    if (password.value.length < 10) {
        let hintErrorMessage = passwordBlock.querySelector('.hint-error');
        let hintError = hintErrorMessage.querySelector('.error');

        hintError.textContent = 'Password is too short!';
        hintErrorMessage.classList.add('show');
        return;
    }

    if (password.value !== conpass.value) {
        let hintErrorMessage = conpassBlock.querySelector('.hint-error');
        let hintError = hintErrorMessage.querySelector('.error');

        hintError.textContent = 'Passwords don\'t match!';
        hintErrorMessage.classList.add('show');
        return;
    }

    // Create new account
    const newAccount = {
        username: usernameBlock.querySelector('input').value,
        password: conpassBlock.querySelector('input').value, // Hash password later
        dateofcreation: DateHandler.getDateToday(),
        level: 1,
        insession: false,
        lastsession: 'n/a',
        notes: [],
        tasks: [],
        projects: [],
        settings: {
            darkmode: localStore.app.settings.darkmode,
            clicksounds: localStore.app.settings.clicksounds,
            hoversounds: localStore.app.settings.hoversounds,
            ambientsounds: localStore.app.settings.ambientsounds,
        }
    };

    // Register new account
    accounts.push(newAccount);
    StorageHandler.updateLocalStorage();

    // ADD A COMPONENT LATER

    FormTerminal.terminalForm(-1);
    Auth.buttons.createButton.removeClicked();
};

/**
 * Changes the terminal into a load account form.
 */
function LoadAccountForm() {
    const template = `
                <div class="account-block">
                    <button type="button" class="button reset text account-info">
                        <span id="username">username</span> | lv<span id="level">1</span> | due today: <span id="due">0</span>
                    </button>
                </div>
    `;

    SetTerminalText(
        'Choosing account...',
        'Users',
        'Please choose your respective account here.',
    );

    const form = FormTerminal.component.querySelector('form');
    form.innerHTML = '';

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);

    const localStore = StorageHandler.getLocalStorage();
    const accounts = localStore.app.accounts;

    for (let iter = 0; iter < accounts.length; iter++) {
        const account = accounts[iter];
        const username = account.username;
        const level = account.level;
        const tasks = account.tasks;

        const fragmentCopy = fragment.querySelector('.account-block').cloneNode(true);
        const spanUsername = fragmentCopy.querySelector('#username');
        const spanLevel = fragmentCopy.querySelector('#level');
        const spanDue = fragmentCopy.querySelector('#due');

        spanUsername.textContent = username;
        spanLevel.textContent = level;


        if (tasks.length === 0) {
            spanDue.textContent = 0;
        } else {
            // Add functionality later
        };

        form.appendChild(fragmentCopy);

        const button = fragmentCopy.querySelector('button');
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            LoginForm(account);
            FormTerminal.preLoginAccount = account;
        });
    };
};

/**
 * Changes the terminal into a login form after choosing an account from load form
 * @param {Object} userData 
*/
function LoginForm(userData) {
    const template = `
    <div class="input-block" id="password-block">
    <div class="input-hint">
                        <p class="hint-text">Please enter your password</p>
                        <button type="button" class="button reset" type="button" id="hide-pass">&lt;/&gt;</button>
                        <div class="hint-error">| <span>Error Message!</span></div>
                    </div>
                    <label for="password">
                        <span>>></span>
                        <input class="text" type="password" name="" id="password">
                    </label>
                </div>
                `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const passwordBlock = fragment.querySelector('#password-block');

    FormTerminal.terminalFormStatus = 4;

    SetTerminalText(
        'Authenticating...',
        'Welcome back,',
        `${userData.username}!`,
    );

    const tipMessage = FormTerminal.component.querySelector('#tip-message');
    const pTitleTip = tipMessage.querySelector('#title-tip');
    const pDescTip = tipMessage.querySelector('#desc-tip');

    pTitleTip.classList.remove('text');
    pDescTip.classList.add('text');

    const form = FormTerminal.component.querySelector('form');

    form.innerHTML = '';
    form.appendChild(passwordBlock);
    FormTerminal.showActions();

    const inputPassword = passwordBlock.querySelector('input');
    const btnHidePassword = passwordBlock.querySelector('button');

    inputPassword.focus();

    // LISTENERS //
    btnHidePassword.addEventListener('click', (e) => {
        HidePasswordToggle(btnHidePassword, inputPassword);
    });
};

function CancelLoginAppearanceReset() {
    FormTerminal.preLoginAccount = undefined;

    const tipMessage = FormTerminal.component.querySelector('#tip-message');
    const pTitleTip = tipMessage.querySelector('#title-tip');
    const pDescTip = tipMessage.querySelector('#desc-tip');

    pTitleTip.classList.add('text');
    pDescTip.classList.remove('text');
}

/**
 * Changes the terminal into a settings form.
 */
function SettingsForm() {
    const template = `
                <div class="setting-block" id="dark-mode-block">
                    <input type="checkbox" name="" id="dark-mode">
                    <p class="text message">Dark Mode:</p>
                    <button type="button" class="button reset text option">[no]</button>
                </div>
                <div class="setting-block" id="click-block">
                    <input type="checkbox" name="" id="click-sound">
                    <p class="text message">Click sounds:</p>
                    <button type="button" class="button reset text option">[yes]</button>
                </div>
                <div class="setting-block" id="hover-block">
                    <input type="checkbox" name="" id="hover-sound">
                    <p class="text message">Hover sounds:</p>
                    <button type="button" class="button reset text option">[yes]</button>
                </div>
                <div class="setting-block" id="ambient-block">
                    <input type="checkbox" name="" id="ambient-sound">
                    <p class="text message">Ambient sounds:</p>
                    <button type="button" class="button reset text option">[yes]</button>
                </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const darkModeBlock = fragment.querySelector('#dark-mode-block');
    const clickBlock = fragment.querySelector('#click-block');
    const hoverBlock = fragment.querySelector('#hover-block');
    const ambientBlock = fragment.querySelector('#ambient-block');

    SetTerminalText(
        'Configuring settings...',
        'Settings',
        'These are default settings when creating a new account.',
    );

    const form = FormTerminal.component.querySelector('form');
    form.innerHTML = '';

    form.appendChild(darkModeBlock);
    form.appendChild(clickBlock);
    form.appendChild(hoverBlock);
    form.appendChild(ambientBlock);

    const btnDarkMode = darkModeBlock.querySelector('button');
    const btnClickSound = clickBlock.querySelector('button');
    const btnHoverSound = hoverBlock.querySelector('button');
    const btnAmbientSound = ambientBlock.querySelector('button');
    const inputDarkMode = darkModeBlock.querySelector('input');
    const inputClickSound = clickBlock.querySelector('input');
    const inputHoverSound = hoverBlock.querySelector('input');
    const inputAmbientSound = ambientBlock.querySelector('input');

    // INITIALIZE DEFAULT SETTINGS //
    const localStore = StorageHandler.getLocalStorage();
    const localSettings = localStore.app.settings;

    inputDarkMode.checked = localSettings.darkmode;
    inputClickSound.checked = localSettings.clicksounds;
    inputHoverSound.checked = localSettings.hoversounds;
    inputAmbientSound.checked = localSettings.ambientsounds;

    if (inputDarkMode.checked) btnDarkMode.textContent = '[yes]';
    else btnDarkMode.textContent = '[no]';

    if (inputClickSound.checked) btnClickSound.textContent = '[yes]';
    else btnClickSound.textContent = '[no]';

    if (inputHoverSound.checked) btnHoverSound.textContent = '[yes]';
    else btnHoverSound.textContent = '[no]';

    if (inputAmbientSound.checked) btnAmbientSound.textContent = '[yes]';
    else btnAmbientSound.textContent = '[no]';
    // INITIALIZE DEFAULT SETTINGS //

    btnDarkMode.addEventListener('click', (e) => {
        e.stopPropagation();

        inputDarkMode.checked = !inputDarkMode.checked;
        if (inputDarkMode.checked) btnDarkMode.textContent = '[yes]';
        else btnDarkMode.textContent = '[no]';

        localSettings.darkmode = inputDarkMode.checked;
        StorageHandler.updateLocalStorage();
    });

    btnClickSound.addEventListener('click', (e) => {
        e.stopPropagation();

        inputClickSound.checked = !inputClickSound.checked;
        if (inputClickSound.checked) btnClickSound.textContent = '[yes]';
        else btnClickSound.textContent = '[no]';

        localSettings.clicksounds = inputClickSound.checked;
        StorageHandler.updateLocalStorage();
    });

    btnHoverSound.addEventListener('click', (e) => {
        e.stopPropagation();

        inputHoverSound.checked = !inputHoverSound.checked;
        if (inputHoverSound.checked) btnHoverSound.textContent = '[yes]';
        else btnHoverSound.textContent = '[no]';

        localSettings.hoversounds = inputHoverSound.checked;
        StorageHandler.updateLocalStorage();
    });

    btnAmbientSound.addEventListener('click', (e) => {
        e.stopPropagation();

        inputAmbientSound.checked = !inputAmbientSound.checked;
        if (inputAmbientSound.checked) btnAmbientSound.textContent = '[yes]';
        else btnAmbientSound.textContent = '[no]';

        localSettings.ambientsounds = inputAmbientSound.checked;
        StorageHandler.updateLocalStorage();
    });
};

function SetTerminalText(statusMsg, titleTipMsg, descTipMsg) {
    const status_message = FormTerminal.component.querySelector('#message');
    const tip_message = FormTerminal.component.querySelector('#tip-message');
    const title_tip = tip_message.querySelector('#title-tip');
    const desc_tip = tip_message.querySelector('#desc-tip');

    status_message.textContent = statusMsg;
    title_tip.textContent = titleTipMsg;
    desc_tip.textContent = descTipMsg;
};

export default FormTerminal;