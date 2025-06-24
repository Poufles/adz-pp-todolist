import './FormTerminal.css';

export default function FormTerminal() {
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
        if (component.classList.contains('default')) {
            component.classList.add('default');
            return true;
        };

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

        component.classList.remove('default');
        terminalFormStatus = type;

        if (type === 1) {
            NewAccountForm(component);
            showActions();
        } else if (type === 2) {
            LoadAccountForm(component);
            hideActions();
        } else if (type === 3) {
            SettingsForm(component);
            showActions();
        } else {
            DefaultForm(component);
            hideActions();
        };
    };

    const resetForm = () => {
        if (terminalFormStatus === 1) {
            NewAccountForm(component);
        } else if (terminalFormStatus === 2) {
            LoadAccountForm(component);
        } else {
            SettingsForm(component);
        };
    };

    return {
        component,
        actionButtons,
        render,
        unrender,
        isDefaultState,
        hideActions,
        showActions,
        terminalForm,
        resetForm
    };
};

/**
 * Changes the terminal into default.
 * @param {HTMLElement} component 
 */
function DefaultForm(component) {
    SetTerminalText(
        component,
        'Waiting for input...',
        '',
        '',
    );

    const form = component.querySelector('form');
    form.innerHTML = '';
};

/**
 * Changes the terminal into a new account form.
 * @param {HTMLElement} component 
 */
function NewAccountForm(component) {
    const template = `
                <div class="input-block" id="username-block">
                    <div class="input-hint">
                        <p class="hint-text">Username</p>
                        <div class="hint-error">| <span></span></div>
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
                        <div class="hint-error">| <span></span></div>
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
                        <div class="hint-error">| <span></span></div>
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
        component,
        'Creating new account...',
        'Welcome!',
        'The only rule in creating an account is that your password must be at least 10 characters long.',
    );

    const form = component.querySelector('form');
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
        if (inputUsername.value !== '' && e.key === 'Enter') {
            form.appendChild(passwordBlock);
            inputPassword.focus();
        };
    });

    inputUsername.addEventListener('focus', (e) => {
        e.stopPropagation();

        if (form.contains(passwordBlock) && inputPassword.value === '') form.removeChild(passwordBlock);
    });

    inputPassword.addEventListener('keydown', (e) => {
        if (inputPassword.value !== '' && e.key === 'Enter') {
            form.appendChild(conpassBlock);
            inputConpass.focus();
        };
    });

    inputPassword.addEventListener('focus', (e) => {
        if (form.contains(conpassBlock) && conpassBlock.value === '') form.removeChild(conpassBlock);
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
        button.textContent = '<o>';
        input.type = 'password';
    };

    input.focus();
};

/**
 * Changes the terminal into a load account form.
 * @param {HTMLElement} component 
 */
function LoadAccountForm(component) {
    SetTerminalText(
        component,
        'Choosing account...',
        'Users',
        'Please choose your respective account here.',
    );

    const form = component.querySelector('form');
    form.innerHTML = '';

};

/**
 * Changes the terminal into a settings form.
 * @param {HTMLElement} component 
 */
function SettingsForm(component) {
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
        component,
        'Configuring settings...',
        'Settings',
        'These are default settings when creating a new account.',
    );

    const form = component.querySelector('form');
    form.innerHTML = '';

    form.appendChild(darkModeBlock);
    form.appendChild(clickBlock);
    form.appendChild(hoverBlock);
    form.appendChild(ambientBlock);

    // ADD FUNCTION FOR SETTINGS LATER

    const btnDarkMode = darkModeBlock.querySelector('button');
    const btnClickSound = clickBlock.querySelector('button');
    const btnHoverSound = hoverBlock.querySelector('button');
    const btnAmbientSound = ambientBlock.querySelector('button');
    const inputDarkMode = darkModeBlock.querySelector('input');
    const inputClickSound = clickBlock.querySelector('input');
    const inputHoverSound = hoverBlock.querySelector('input');
    const inputAmbientSound = ambientBlock.querySelector('input');

    btnDarkMode.addEventListener('click', (e) => {
        e.stopPropagation();

        inputDarkMode.checked = !inputDarkMode.checked;
        if (inputDarkMode.checked) btnDarkMode.textContent = '[yes]';
        else btnDarkMode.textContent = '[no]';
    });
    
    btnClickSound.addEventListener('click', (e) => {
        e.stopPropagation();
        
        inputClickSound.checked = !inputClickSound.checked;
        if (inputClickSound.checked) btnClickSound.textContent = '[yes]';
        else btnClickSound.textContent = '[no]';
    });
    
    btnHoverSound.addEventListener('click', (e) => {
        e.stopPropagation();
        
        inputHoverSound.checked = !inputHoverSound.checked;
        if (inputHoverSound.checked) btnHoverSound.textContent = '[yes]';
        else btnHoverSound.textContent = '[no]';
    });
    
    btnAmbientSound.addEventListener('click', (e) => {
        e.stopPropagation();
        
        inputAmbientSound.checked = !inputAmbientSound.checked;
        if (inputAmbientSound.checked) btnAmbientSound.textContent = '[yes]';
        else btnAmbientSound.textContent = '[no]';
    });
};

function SetTerminalText(component, statusMsg, titleTipMsg, descTipMsg) {
    const status_message = component.querySelector('#message');
    const tip_message = component.querySelector('#tip-message');
    const title_tip = tip_message.querySelector('#title-tip');
    const desc_tip = tip_message.querySelector('#desc-tip');

    status_message.textContent = statusMsg;
    title_tip.textContent = titleTipMsg;
    desc_tip.textContent = descTipMsg;
};