import './ButtonVideoGame.css';

/**
 * Creates a button with a video game style
 * @param {String} buttonText - Text to show 
 * @returns 
 */
export default function ButtonVideoGame(buttonText) {
    const template = `
    <button class="component button reset video-game">
        <span class="arrow-wrapper">
            <span class="arrows">>>></span>
        </span>
        <span class="text">${buttonText || 'Button'}</span>
    </button>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.component');

    /**
     * Renders component to the provided parent.
     * @param {HTMLElement} parent 
     */
    const render = (parent) => {
        if (!parent) {
            console.error('No given argument for the parent. Please provide one.');
            return;
        };

        if (!parent.contains(component)) parent.appendChild(component);
    };

    /**
     * Unrenders the component.
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent) parent.removeChild(component);
    };

    /**
     * Check if button is clicked.
     * @returns A boolean value.
     */
    const isClicked = () => {
        if (component.classList.contains('clicked')) return true;
        return false;
    };

    /**
     * Removes clicked class.
     */
    const removeClicked = () => {
        component.classList.remove('clicked');
    };

    // LISTENER //
    component.addEventListener('click', (e) => {
        e.stopPropagation();

        component.classList.add('clicked');
    });

    return {
        component,
        render,
        unrender,
        isClicked,
        removeClicked
    };
};