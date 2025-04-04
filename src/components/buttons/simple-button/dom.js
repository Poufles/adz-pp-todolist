import SimpleButton from "./simple-button.js";

const loadGame = SimpleButton('start');
const newGame = SimpleButton('start');
const settings = SimpleButton('start');
const randy = SimpleButton();

document.body.appendChild(loadGame.render());
document.body.appendChild(newGame.render());
document.body.appendChild(settings.render());
document.body.appendChild(randy.render());

