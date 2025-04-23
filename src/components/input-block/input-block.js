import DateHandler from "../../scripts/date-handler.js";

/**
 * 
 * @param {{
 * inputType: string,
 * title: string,
 * inputId: string,
 * isOptional: boolean,
 * hint: {
 *  hasHint: boolean,
 *  title: string,
 *  message: string,
 *  clickable: string
 * }
 * }}
 * @returns 
 */
function InputBlock({
    inputType = 'one',
    title = 'Input title',
    inputId = 'item',
    isOptional = false,
    hint = {
        hasHint: false,
        title: 'hint title',
        message: "i'm a hint",
        clickable: false,
    }
} = {}) {
    const template =
        `
        <article class="comp input-block ${inputType}-liner">
            <label for="item" class="input-label select-none cursor-default">
                <span class="title">${title}: </span> 
            </label>
            <div class="input-wrapper">
                <span class="arrow select-none">&gt;</span>
            </div>
        </article>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('article.input-block');

    const input_label = component.querySelector('.input-label');
    const optionalComponent = CreateOptional(isOptional);

    input_label.appendChild(optionalComponent);

    let objectComponents

    if (inputType.toLowerCase() === 'one') {
        objectComponents = CreateOneLiner(component, inputId);
    } else if (inputType.toLowerCase() === 'multi') {
        objectComponents = CreateMultiLiner(component, inputId);
    } else if (inputType.toLowerCase() === 'time') {
        objectComponents = CreateTimeLiner(component, inputId);
    } else {
        console.log(`Type argument (${inputType}) is not a proper type.`);

        return false;
    };

    const inputComponent = objectComponents.input;
    let hintComponent;

    if (hint.hasHint) {
        hintComponent = CreateHint(hint.title, hint.message, hint.clickable);

        component.appendChild(hintComponent);
    };

    if (inputComponent) {
        const arrow = component.querySelector('.input-wrapper .arrow');

        inputComponent.addEventListener('keydown', (e) => {
            if (arrow.classList.contains('stagnant')) arrow.classList.remove('stagnant');

            arrow.classList.add('typing');
        });

        inputComponent.addEventListener('keyup', (e) => {
            arrow.classList.remove('typing');
        });

        inputComponent.addEventListener('blur', (e) => {
            if (inputComponent.value) {
                arrow.classList.add('stagnant');
            } else {
                arrow.classList.remove('stagnant');
            }
        });

        inputComponent.addEventListener('focus', (e) => {
            e.stopPropagation();

            if (optionalComponent && optionalComponent.classList.contains('show')) {
                optionalComponent.classList.remove('show');
            };
        });
    };

    if (objectComponents.timeInputs) {
        objectComponents.timeInputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.stopPropagation();
    
                if (optionalComponent && optionalComponent.classList.contains('show')) {
                    optionalComponent.classList.remove('show');
                };
            });
        });
    };

    /**
     * Renders the component
     * @param {HTMLElement} parent - (Optional) Parent element to where the component must be appended  
     * @returns The component itself if not argument is passed
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Unrenders the component automatically from its parent
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) {
            parent.removeChild(component);
        };
    };

    /**
     * Enables all inputtable and clickable elements
     */
    const enable = () => {
        const inputElements = component.querySelector('input');
        const textareaElements = component.querySelector('textarea');
    };

    /**
     * Disables all inputtable and clickable elements
     */
    const disable = () => {

    };

    const removeInput = () => {
        const inputElements = component.querySelectorAll('input');
        const textareaElements = component.querySelector('textarea');

        if (inputElements) {
            inputElements.forEach(input => {
                if (input.type === 'button') {
                    input.value = input.dataset.initial;

                    return;
                };

                input.value = '';
            });
        };

        if (textareaElements) {
            textareaElements.value = '';
        };
    };

    /**
     * Shows hint if it exists
     */
    const showHint = () => {
        if (hint.hasHint && hintComponent) {
            hintComponent.classList.remove('hidden');
        };
    };

    /**
     * Hides hint if it exists
     */
    const hideHint = () => {
        if (hint.hasHint && hintComponent) {
            hintComponent.classList.add('hidden');
        };
    };

    /**
     * Adds clickables in the hint.
     * @param {{
     *  refresh: boolean,
     * }} option
     * @param  {...HTMLButtonElement} clickables
     */
    const addClickables = ({ refresh = false } = {}, ...clickables) => {
        if (refresh && hint.hasHint && hint.clickable && hintComponent) {
            const button_group = hintComponent.querySelector('.button-group');

            button_group.innerHTML = '';
        };

        if (hint.hasHint && hint.clickable && hintComponent) {
            const button_group = hintComponent.querySelector('.button-group');

            clickables.forEach(clickable => {
                button_group.appendChild(clickable);
            });
        };
    };

    /**
     * Removes all clickables
     */
    const removeClickables = () => {
        if (hint.hasHint && hint.clickable && hintComponent) {
            const button_group = hintComponent.querySelector('.button-group');

            button_group.innerHTML = '';
        };
    };

    const requiredMessage = (message = 'required') => {
        if (!isOptional) {
            optionalComponent.textContent = `(${message})`;
            optionalComponent.classList.add('show');
        };
    };

    const removeRequiredMessage = () => {
        if (!isOptional) {
            optionalComponent.textContent = `(optional)`;
            optionalComponent.classList.remove('show');
        };
    };

    const addPlaceholder = (placeholder) => {
        inputComponent.placeholder = placeholder;
    };

    return {
        component,
        inputComponent,
        isOptional,
        render,
        unrender,
        enable,
        disable,
        showHint,
        hideHint,
        addClickables,
        removeClickables,
        removeInput,
        requiredMessage,
        removeRequiredMessage,
        addPlaceholder
    };
};

/**
 * Creates a one liner input block component
 * @param {HTMLElement} component - Component to handle 
 * @param {string} inputId - Component's id
 * @returns {{
 *  input: HTMLInputElement
 * }}
 */
function CreateOneLiner(component, inputId) {
    const template =
        `
        <input type="text" id="${inputId}">
    `;

    const fragment = CreateFragment(template);
    const input = fragment.querySelector('input');

    const cont_inputWrapper = component.querySelector('.input-wrapper');

    cont_inputWrapper.appendChild(input);

    return {
        input
    };
};

/**
 * Creates a multi liner input block component
 * @param {HTMLElement} component - Component to handle 
 * @param {string} inputId - Component's id
 * @returns {{
*  input: HTMLInputElement
* }}
*/
function CreateMultiLiner(component, inputId) {
    const template =
        `
        <textarea name="" id="${inputId}" rows="1"></textarea>
    `;

    const fragment = CreateFragment(template);
    const input = fragment.querySelector('textarea');

    const cont_inputWrapper = component.querySelector('.input-wrapper');

    cont_inputWrapper.appendChild(input);

    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
    });

    return {
        input
    }
};

/**
 * Creates a time input block component
 * @param {HTMLElement} component - Component to handle 
 * @param {string} inputId - Component's id
 */
function CreateTimeLiner(component, inputId) {
    const timeNow = DateHandler.currentTime().toString();
    const dateNow = DateHandler.currentDate().toString();

    const template =
        `
        <div class="time-format select-none" id="${inputId}">
            <input type="number" name="" id="hour-ten" placeholder="${timeNow.slice(0, 1)}"><input type="number" name="" id="hour-one" placeholder="${timeNow.slice(1, 2)}">:<input type="number" name="" id="minute-ten" placeholder="${timeNow.slice(3, 4)}"><input type="number" name="" id="minute-one" placeholder="${timeNow.slice(4, 5)}"><input class="btn" type="button" data-initial="${timeNow.slice(5, 7).toLowerCase()}" id="meridian" value="${timeNow.slice(5, 7).toLowerCase()}"> | <input type="number" name="" id="month-ten" placeholder="${dateNow.slice(0, 1)}"><input type="number" name="" id="month-one" placeholder="${dateNow.slice(1, 2)}">/<input type="number" name="" id="day-ten" placeholder="${dateNow.slice(3, 4)}"><input type="number" name="" id="day-one" placeholder="${dateNow.slice(4, 5)}">/<input type="number" name="" id="year-mille" placeholder="${dateNow.slice(6, 7)}"><input type="number" name="" id="year-cent" placeholder="${dateNow.slice(7, 8)}"><input type="number" name="" id="year-ten" placeholder="${dateNow.slice(8, 9)}"><input type="number" name="" id="year-one" placeholder="${dateNow.slice(9, 10)}">
        </div>
    `;

    const fragment = CreateFragment(template);
    const input = fragment.querySelector('.time-format');

    const cont_inputWrapper = component.querySelector('.input-wrapper');

    cont_inputWrapper.appendChild(input);

    const input_meridian = component.querySelector('#meridian');
    const arrow = cont_inputWrapper.querySelector('.arrow');
    const timeInputs = [];
    const input_ht = input.querySelector('#hour-ten');
    const input_ho = input.querySelector('#hour-one');
    const input_mt = input.querySelector('#minute-ten');
    const input_mo = input.querySelector('#minute-one');
    const input_mot = input.querySelector('#month-ten');
    const input_moo = input.querySelector('#month-one');
    const input_dt = input.querySelector('#day-ten');
    const input_do = input.querySelector('#day-one');
    const input_ym = input.querySelector('#year-mille');
    const input_yc = input.querySelector('#year-cent');
    const input_yt = input.querySelector('#year-ten');
    const input_yo = input.querySelector('#year-one');

    timeInputs.push(input_ht);
    timeInputs.push(input_ho);
    timeInputs.push(input_mt);
    timeInputs.push(input_mo);
    timeInputs.push(input_meridian);
    timeInputs.push(input_mot);
    timeInputs.push(input_moo);
    timeInputs.push(input_dt);
    timeInputs.push(input_do);
    timeInputs.push(input_ym);
    timeInputs.push(input_yc);
    timeInputs.push(input_yt);
    timeInputs.push(input_yo);

    timeInputs.forEach(timeInput => {
        timeInput.addEventListener('input', (e) => {
            e.stopPropagation();

            if (timeInput.value) {
                for (let index = 0; index < timeInputs.length; index++) {
                    const nextInput = timeInputs[index];

                    if (nextInput.value === '') {
                        nextInput.focus();
                        break;
                    };
                };
            };
        });

        timeInput.addEventListener('keydown', (e) => {
            e.stopPropagation();

            const index = timeInputs.indexOf(timeInput);

            if (e.key === 'Backspace') {
                if (timeInput.value === '') {
                    e.preventDefault();

                    if (timeInputs[index - 1] && timeInputs[index - 1].type === 'button') {
                        timeInputs[index - 2].focus();
                        return;
                    }

                    if (index - 1 !== -1) {
                        timeInputs[index - 1].focus();
                    };
                };
            };

            if (e.key === 'ArrowLeft') {
                if (index - 1 !== -1) {
                    timeInputs[index - 1].focus();
                };
            };

            if (e.key === 'ArrowRight') {
                if (index + 1 !== timeInputs.length) {
                    timeInputs[index + 1].focus();
                };
            };
        });

        if (timeInput.id !== 'meridian') {
            timeInput.addEventListener('input', (e) => {
                e.stopPropagation();

                const nums = '0123456789';
                const value = timeInput.value;

                if (!nums.includes(value.slice(1, 2))) return;

                if (value.length > 1) {
                    timeInput.value = value.slice(1, 2);
                };
            });

            timeInput.addEventListener('keydown', (e) => {
                e.stopPropagation();

                const value = timeInput.value;

                if (e.key === '.' || e.key === '-') {
                    setTimeout(() => {
                        timeInput.value = value.slice(0, 1);
                    }, 0);

                    return;
                };
            });
        };
    });

    input_meridian.addEventListener('click', () => {
        input_meridian.value = input_meridian.value === 'am' ? 'pm' : 'am';
    });

    input_meridian.addEventListener('mousedown', () => {
        if (arrow.classList.contains('stagnant')) arrow.classList.remove('stagnant');

        arrow.classList.add('typing');
    });

    input_meridian.addEventListener('mouseup', () => {
        arrow.classList.remove('typing');
    });

    return {
        input,
        timeInputs
    };
};

/**
 * Creates an optional component
 * @returns Returns optional component
 */
function CreateOptional(isOptional) {
    const template =
        `
        <span class="${isOptional ? 'optional' : 'required'}">(optional)</span>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('span');

    return component;
};

/**
 * 
 * @param {HTMLElement} component 
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} clickable 
 */
function CreateHint(title, message, clickable) {
    const template =
        `
        <div class="hint cursor-default select-none">
            <span class="title">${title}: </span>
        </div>
    `;

    const fragment = CreateFragment(template);
    const component = fragment.querySelector('.hint');

    if (clickable) {
        const clickableTemplate =
            `
            <div class="button-group"></div>
        `;

        const fragment = CreateFragment(clickableTemplate);
        const container = fragment.querySelector('div');

        component.appendChild(container);
    } else {
        const messageTemplate =
            `
        <span class="text">${message}</span>
        `;

        const fragment = CreateFragment(messageTemplate);
        const container = fragment.querySelector('span');

        component.appendChild(container);
    };

    return component;
};

/**
 * Creates a contextual fragment
 * @param {string} template - HTML template to make a fragment
 * @returns A contextual fragment of the template (HTMLElement) 
 */
function CreateFragment(template) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(template);

    return fragment;
}

export default InputBlock;