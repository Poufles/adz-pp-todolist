import '../../styles/main.css';
import './auth-responsive.css';
import '../../components/Buttons/ButtonStyle.css';

import ButtonVideoGame from '../../components/Buttons/VideoGame/ButtonVideoGame.js';
import FormTerminal from '../../components/Forms/Terminal/FormTerminal.js';

const Auth = function () {
    const page = document.body.querySelector('#page__auth');

    // BUTTONS INITIALIZATIONS //

    const bottom_gate = page.querySelector('#bottom-gate');
    const actions = bottom_gate.querySelector('.actions');

    const createBtn = ButtonVideoGame('new account');
    const loadBtn = ButtonVideoGame('load account');
    const settingsBtn = ButtonVideoGame('settings');

    createBtn.render(actions);
    loadBtn.render(actions);
    settingsBtn.render(actions);

    // BUTTONS INITIALIZATIONS //

    // TERMINAL INITIALIZATIONS //

    const terminal = FormTerminal();
    terminal.render(page);

    // TERMINAL INITIALIZATIONS //

    // LISTENERS //
    page.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!terminal.isDefaultState())  {
            terminal.hideActions();
            terminal.terminalForm(-1);
        };
        
        if (createBtn.isClicked()) createBtn.removeClicked();
        if (loadBtn.isClicked()) loadBtn.removeClicked();
        if (settingsBtn.isClicked()) settingsBtn.removeClicked();
    });

    setupButtonListener(
        createBtn, 
        [loadBtn, settingsBtn], 
        terminal,
        1
    );

    setupButtonListener(
        loadBtn, 
        [createBtn, settingsBtn], 
        terminal,
        2
    );

    setupButtonListener(
        settingsBtn, 
        [loadBtn, createBtn], 
        terminal,
        3
    );

    terminal.component.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    terminal.actionButtons.cancel.addEventListener('click', (e) => {
        e.stopPropagation();

        if (createBtn.isClicked()) createBtn.removeClicked();
        if (loadBtn.isClicked()) loadBtn.removeClicked();
        if (settingsBtn.isClicked()) settingsBtn.removeClicked();

        terminal.terminalForm(-1);
        terminal.hideActions();
    });

    terminal.actionButtons.reset.addEventListener('click', (e) => {
        e.stopPropagation();

        terminal.resetForm();
    });

    // LISTENERS //
}();

/**
 * Setups the listener for buttons
 * @param {HTMLButtonElement} mainBtn 
 * @param {Array} otherBtns 
 * @param {Object} terminal 
 * @param {Number} type
 */
function setupButtonListener(mainBtn, otherBtns, terminal, type) {
    mainBtn.component.addEventListener('click', (e) => {
        e.stopPropagation();
        
        otherBtns.forEach(btn => {
            if (btn.isClicked()) btn.removeClicked();
        });

        terminal.terminalForm(type);
    });
};