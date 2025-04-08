import '../styles/auth.css';
import '../components/buttons/simple-button/simple-button.css';

import SimpleButton from '../components/buttons/simple-button/simple-button.js';

function Auth() {
    const cont_start = document.querySelector('#start');
    const cont_action = cont_start.querySelector('#action');

    let btn_new = SimpleButton('new game', 'start');
    let btn_settings = SimpleButton('settings', 'start');
    let btn_load = SimpleButton('load game', 'start');

    btn_new.render().querySelector('input[type="radio"').checked = true;

    cont_action.appendChild(btn_new.render());
    cont_action.appendChild(btn_load.render());
    cont_action.appendChild(btn_settings.render());
}

Auth();