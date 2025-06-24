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

    FormTerminal.render(page);

    // TERMINAL INITIALIZATIONS //

    // LISTENERS //
    page.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!FormTerminal.isDefaultState())  {
            FormTerminal.hideActions();
            FormTerminal.terminalForm(-1);
        };
        
        if (createBtn.isClicked()) createBtn.removeClicked();
        if (loadBtn.isClicked()) loadBtn.removeClicked();
        if (settingsBtn.isClicked()) settingsBtn.removeClicked();
    });

    setupButtonListener(
        createBtn, 
        [loadBtn, settingsBtn], 
        1
    );

    setupButtonListener(
        loadBtn, 
        [createBtn, settingsBtn], 
        2
    );

    setupButtonListener(
        settingsBtn, 
        [loadBtn, createBtn], 
        3
    );

    FormTerminal.component.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    FormTerminal.actionButtons.cancel.addEventListener('click', (e) => {
        e.stopPropagation();

        if (FormTerminal.terminalFormStatus === 4) {
            FormTerminal.terminalForm(2);
            return;
        };

        if (createBtn.isClicked()) createBtn.removeClicked();
        if (loadBtn.isClicked()) loadBtn.removeClicked();
        if (settingsBtn.isClicked()) settingsBtn.removeClicked();

        FormTerminal.terminalForm(-1);
    });

    FormTerminal.actionButtons.reset.addEventListener('click', (e) => {
        e.stopPropagation();

        FormTerminal.resetForm();
    });

    FormTerminal.actionButtons.confirm.addEventListener('click', (e) => {
        e.stopPropagation();

        FormTerminal.confirmForm();
    });

    // LISTENERS //

    return {
        buttons: {
            createButton: createBtn,
            loadButton: loadBtn,
            settingsButton: settingsBtn
        }
    };
}();

/**
 * Setups the listener for buttons
 * @param {HTMLButtonElement} mainBtn 
 * @param {Array} otherBtns 
 * @param {Number} type
 */
function setupButtonListener(mainBtn, otherBtns, type) {
    mainBtn.component.addEventListener('click', (e) => {
        e.stopPropagation();
        
        otherBtns.forEach(btn => {
            if (btn.isClicked()) btn.removeClicked();
        });

        FormTerminal.terminalForm(type);
    });
};

export default Auth;