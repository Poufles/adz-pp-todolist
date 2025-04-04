const template =
    `
    <div class="arrow">
        <span>></span>
    </div>
    <p class="text">Button</p>
`;

const groupTemplate =
    `
    <label role="button" class="comp btn simple-button group">
        <input type="radio" name="" id="">
        <div class="arrow">
            <span>></span>
        </div>
        <p class="text">Button</p>
    </label>
`;

/**
 * Simple button is a component that creates a simple button
 * that has no background color and seemingly ressembles a
 * normal text
 * @returns 
 */
function SimpleButton(groupName = '') {
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