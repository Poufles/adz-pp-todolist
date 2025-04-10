import '../styles/auth.css';
import '../components/buttons/simple-button/simple-button.css';
import '../components/auth-interface/auth-interface.css';

import SimpleButton from '../components/buttons/simple-button/simple-button.js';
import AuthInterface from '../components/auth-interface/auth-interface.js';

function Auth() {
    const body = document.body;
    const cont_start = document.querySelector('#start');
    const cont_action = cont_start.querySelector('#action');

    const newGame = SimpleButton('new game', 'new');
    const loadGame = SimpleButton('load game', 'load');
    const settings = SimpleButton('settings', 'settings');

    const btn_new = newGame.render();
    const btn_load = loadGame.render();
    const btn_settings = settings.render();

    cont_action.appendChild(btn_new);
    cont_action.appendChild(btn_load);
    cont_action.appendChild(btn_settings);

    body.appendChild(AuthInterface.render());

    btn_new.addEventListener('click', (e) => {
        if (loadGame.isChecked()) loadGame.uncheck();
        if (settings.isChecked()) settings.uncheck();
    
        if (!newGame.isChecked()) {
            newGame.check();
            AuthInterface.OpenNewGame();
        };
    });

    btn_load.addEventListener('click', (e) => {
        if (newGame.isChecked()) newGame.uncheck();
        if (settings.isChecked()) settings.uncheck();
    
        if (!loadGame.isChecked()) {
            loadGame.check();
            AuthInterface.OpenLoadGame();
        };
    });
    
    btn_settings.addEventListener('click', (e) => {
        if (loadGame.isChecked()) loadGame.uncheck();
        if (newGame.isChecked()) newGame.uncheck();
    
        if (!settings.isChecked()) {
            settings.check();
            AuthInterface.OpenSettings();
        };
    });
}

Auth();