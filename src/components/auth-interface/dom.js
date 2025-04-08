import SimpleButton from "../buttons/simple-button/simple-button.js";
import AuthInterface from "./auth-interface.js";

const loadGame = SimpleButton('Load Game');
const newGame = SimpleButton('New Game');
const settings = SimpleButton('Settings');

const body = document.body;
const cont_start = document.createElement('div');
const btn_loadGame = loadGame.render();
const btn_newGame = newGame.render();
const btn_settings = settings.render();

cont_start.appendChild(btn_loadGame);
cont_start.appendChild(btn_newGame);
cont_start.appendChild(btn_settings);
body.appendChild(cont_start);


body.appendChild(AuthInterface.render());

btn_newGame.addEventListener('click', (e) => {
    if (loadGame.isChecked()) loadGame.uncheck();
    if (settings.isChecked()) settings.uncheck();

    if (!newGame.isChecked()) {
        newGame.check();
        AuthInterface.OpenNewGame();
    };
});

btn_loadGame.addEventListener('click', (e) => {
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