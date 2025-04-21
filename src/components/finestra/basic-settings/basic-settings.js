import StorageHandler from '../../../scripts/storage-handler.js';
import Finestra from '../window.js';

const BasicSettings = function() {
    const finestra = Finestra({
        isExpanded: true,
        hasActions: true,
        id: 'settings',
        windowTitle: 'settings',
        titleButtonText: 'see all'
    });

    finestra.addKeyboardAndStatusTip('Configuring settings', 'ctrl + alt + q to cancel', 'arrow keys to navigate', 'enter to save');

    finestra.addContent(GetBasicSettingsBlock());

    return finestra;
}();

function GetBasicSettingsBlock() {
    const account = StorageHandler.GetStorage(true);

    const template = `
    <article class="comp basic-settings">
        <div class="block select-none" id="dark-mode">
            <label for="set-dm" class="text btn">Dark mode(y/n):</label>
            <input type="text" id="set-dm" value="${account.preference.darkmode ? 'y' : 'n'}">
        </div>
        <div class="block select-none" id="sounds">
            <label for="set-sn" class="text btn">Sounds(y/n):</label>
            <input type="text" id="set-sn" value="${account.preference.sound.all ? 'y' : 'n'}">
            <div class="sub">
                <div class="block select-none" id="background">
                    <label for="set-bg" class="text btn">Background(y/n):</label>
                    <input type="text" id="set-bg" value="${account.preference.sound.background ? 'y' : 'n'}">
                </div>
                <div class="block select-none" id="keyboard">
                    <label for="set-kb" class="text btn">Keyboard(y/n):</label>
                    <input type="text" id="set-kb" value="${account.preference.sound.keyboard ? 'y' : 'n'}">
                </div>
                <div class="block select-none" id="click">
                    <label for="set-cl" class="text btn">Click(y/n):</label>
                    <input type="text" id="set-cl" value="${account.preference.sound.click ? 'y' : 'n'}">
                </div>
            </div>
        </div>
    </article>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.basic-settings');
    const inputArr = [];

    const input_dark = component.querySelector('#set-dm');
    const input_sound = component.querySelector('#set-sn');
    const input_background = component.querySelector('#set-bg');
    const input_keyboard = component.querySelector('#set-kb');
    const input_click = component.querySelector('#set-cl');

    inputArr.push(input_dark);
    inputArr.push(input_sound);
    inputArr.push(input_background);
    inputArr.push(input_keyboard);
    inputArr.push(input_click);

    inputArr.forEach(input => {
        input.addEventListener('keydown', (e) => {
            e.preventDefault();

            const inputLength = inputArr.length;
            const inputIndex = inputArr.indexOf(input);

            if (e.key.toLowerCase() === 'y') {
                input.value = 'y'; return;
            };

            if (e.key.toLowerCase() === 'n') {
                input.value = 'n'; return;
            };

            if (e.key === 'Backspace') {
                input.value = input.value === 'y' ? 'n' : 'y';
                return;
            };

            if (e.key === 'ArrowUp') {

                if (inputIndex - 1 === -1) {
                    inputArr[inputLength - 1].focus();
                } else {
                    inputArr[inputIndex - 1].focus()
                };

                return;
            };

            if (e.key === 'ArrowDown') {

                if (inputIndex + 1 === inputLength) {
                    inputArr[0].focus();
                } else {
                    inputArr[inputIndex + 1].focus()
                };

            };
        });
    });
    
    return component;
};

export default BasicSettings;