import SVG from '../../scripts/svg.js';
import SimpleButton from '../buttons/simple-button/simple-button.js';

const template =
    `
        <div id="upper">
            <div id="actions">

            </div>
            <div id="socmed">
                <p class="cursor-default select-none" id="author">poufsadev</p>
            </div>
        </div>
        <div id="lower">
            <p class="cursor-default select-none" id="status-msg">
                Status: <span id="status">Waiting input</span>...
            </p>
        </div>
`;

const template_tip_msg =
    `
    <span class="tip" id="tip-1">- ctrl + q to cancel/back</span>
    <span class="tip" id="tip-2">- ctrl + r to reset</span>
    <span class="tip" id="tip-3">- enter to proceed/confirm</span>
`;

/**
 * Component module for AuthInterface component
 */
const AuthInterface = function () {
    // Creating component
    const component = document.createElement('section');

    component.classList.add('comp', 'auth-interface');
    component.innerHTML = template;

    LoadComponentElements(component);

    /**
     * Renders the component
     * @returns the component
     */
    const render = () => component;

    const OpenNewGame = () => {
        InitializeStartElements(component, 'Creating account');
        LoadNewGameElements(component);
    };

    const OpenLoadGame = () => {
        InitializeStartElements(component, 'Choosing account');
        LoadLoadGameElements(component);
    };

    const OpenSettings = () => {
        InitializeStartElements(component, 'Configuring settings');
        LoadSettingsElements(component);
    };

    return {
        render,
        OpenNewGame,
        OpenLoadGame,
        OpenSettings
    }
}();

/**
 * Loads the elements for the component
 * @param {HTMLElement} component - AuthInterface component
 */
function LoadComponentElements(component) {
    const cont_socmed = component.querySelector('#socmed');
    const a_github = document.createElement('a');
    const a_instagram = document.createElement('a');
    const a_twitter = document.createElement('a');

    a_github.target = 'blank';
    a_instagram.target = 'blank';
    a_twitter.target = 'blank';

    a_github.href = 'https://github.com/Poufles';
    a_instagram.href = 'https://www.instagram.com/poufsadev/';
    a_twitter.href = 'https://x.com/Vqliant';

    a_github.appendChild(SVG.i_github);
    a_instagram.appendChild(SVG.i_instagram);
    a_twitter.appendChild(SVG.i_twitter);

    cont_socmed.appendChild(a_github);
    cont_socmed.appendChild(a_instagram);
    cont_socmed.appendChild(a_twitter);
};

/**
 * Loads the new game elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadNewGameElements(component) {
    const template =
    `
        <div class="input-block" id="block-username">
            <label for=""></label>
            <div class="input-box">
                <p id="arrow">></p>
                <input type="text" id="">
            </div>
        </div>
    `;
};

/**
 * Loads the load game elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadLoadGameElements(component) {

};

/**
 * Loads the setting elements
 * @param {HTMLElement} component - the AuthInterface component 
 */
function LoadSettingsElements(component) {

};

/**
 * Initialize certain elements for each start actions
 * @param {HTMLElement} component - Auth Interface component
 * @param {string} statusText - Text for the status message
 */
function InitializeStartElements(component, statusText) {
    const cont_actions = component.querySelector('#actions');
    const btn_action_cancel = cont_actions.querySelector('#action-cancel');
    const btn_action_reset = cont_actions.querySelector('#action-reset');

    if (btn_action_cancel) cont_actions.removeChild(btn_action_cancel);
    if (btn_action_reset) cont_actions.removeChild(btn_action_reset);

    const btn_cancel = SimpleButton('Cancel', 'action-cancel');
    const btn_reset = SimpleButton('Reset', 'action-reset');

    const span_status = component.querySelector('#status');
    span_status.textContent = statusText;

    cont_actions.appendChild(btn_cancel.render());
    cont_actions.appendChild(btn_reset.render());

    const cont_lower = component.querySelector('#lower');
    const cont_tip_msg = cont_lower.querySelector('#tip-msg');

    if (!cont_tip_msg) {
        const p_tip_msg = document.createElement('p');
        p_tip_msg.innerHTML = template_tip_msg;
        p_tip_msg.setAttribute('id', 'tip-msg');
        cont_lower.appendChild(p_tip_msg);
    };
};

export default AuthInterface;