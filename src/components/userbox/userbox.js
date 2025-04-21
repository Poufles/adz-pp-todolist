import StorageHandler from "../../scripts/storage-handler.js";

const UserBox = function () {
    const account = StorageHandler.GetStorage(true);

    const template = `
    <section class="misc comp userbox" id="user-profile">
        <div id="user-block">
            <p id="user-info">
                <span id="username">${account.username}</span> | lv<span id="level">${account.level}</span>
            </p>
        </div>
        <div id="level-bar-block">
            <div id="level-bar"></div>
            <p id="experience">
                <span id="current-experience">0</span>/<span id="required-experiece">20</span>xp
            </p>
        </div>
    </section>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.userbox');

    /**
     * Renders the component.
     * @param {HTMLElement} parent - The parent component to where the component must be appended.
     * @returns The component if no parent is provided. 
     */
    const render = (parent) => {
        if (!parent) return component;

        parent.appendChild(component);
    };

    /**
     * Automatically unrenders the component
     */
    const unrender = () => {
        const parent = component.parentElement;

        if (parent && parent.contains(component)) parent.removeChild(component);
    };

    return {
        render,
        unrender
    };
}();

export default UserBox;