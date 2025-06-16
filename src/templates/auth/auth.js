import '../../styles/main.css';
import './auth.css'
import '../../components/Buttons/ButtonStyle.css';

import ButtonVideoGame from '../../components/Buttons/VideoGame/ButtonVideoGame.js';

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
}();