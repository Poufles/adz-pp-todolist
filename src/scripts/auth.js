import '../styles/auth.css';
import '../components/buttons/simple-button/simple-button.css';

import SimpleButton from '../components/buttons/simple-button/simple-button.js';

function Auth() {
    const cont_start = document.querySelector('#start');
    const cont_action = cont_start.querySelector('#action');

    const newGame = SimpleButton('new game', 'new');
    const loadGame = SimpleButton('load game', 'load');
    const settings = SimpleButton('settings', 'settings');

    const btn_new = newGame.render();
    const btn_load = loadGame.render();
    const btn_settings = settings.render();

    btn_new.classList.add('clicked');

    cont_action.appendChild(btn_new);
    cont_action.appendChild(btn_load);
    cont_action.appendChild(btn_settings);
}

Auth();