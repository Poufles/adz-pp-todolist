const template =
    `
    <div class="arrow">
        <span>></span>
    </div>
    <p class="text"></p>
`;

const groupTemplate =
    `
    <label role="button" class="comp btn simple-button group">
        <input type="radio" name="" id="">
        <div class="arrow">
            <span>></span>
        </div>
        <p class="text"></p>
    </label>
`;

/**
 * Simple button is a component that creates a simple button
 * that has no background color and seemingly ressembles a
 * normal text
 * @param {string} buttonName - Text to display in the button
 * @param {string} [groupName] - (Optional) The group name of the button
 * @returns 
 */
function SimpleButton(buttonName, groupName = '') {
    // Creating component
    let component;

    // Verify if button is meant for a specific group or not
    if (groupName !== '') {
        component = document.createElement('label');

        component.classList.add('comp', 'btn', 'simple-button', 'group');
        component.innerHTML = groupTemplate;

        const checkbox = component.querySelector('input[type="radio"]');

        checkbox.setAttribute('name', groupName);

        // Add animation
        component.addEventListener('mouseenter', () => {
            component.classList.add('clicked');
            checkbox.checked = true;
        });
    } else {
        component = document.createElement('button');

        component.classList.add('comp', 'btn', 'simple-button');
        component.innerHTML = template;
        
        // Add animation
        component.addEventListener('click', () => {
            component.classList.add('clicked');
        });
    };

    const p_name = component.querySelector('.text');
    p_name.textContent = buttonName;

    // Methods
    /**
     * @returns component (Element Node)
     */
    const render = () => component;

    /**
     * Unrenders component
     * @param {Node} parentNode - Parent node to unrender the
     * element from 
     */
    const unrender = (parentNode) => { parentNode.removeChild(component) };

    return {
        render,
        unrender
    };
};

export default SimpleButton;