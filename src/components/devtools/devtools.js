import StorageHandler from "../../scripts/storage-handler.js";

const DevTools = function () {
    const template =
        `
        <div class="wrapper">
            <section id="devtools">
                <button type="button" class="btn" id="actions">Dev</button>
                <div class="" id="tools">
                    <button type="button" class="animate btn" id="auth-exit">Exit Auth Animation</button>
                    <button type="button" class="btn" id="no-auth">Remove Auth</button>
                    <button type="button" class="btn" id="logout">Logout</button>
                </div>
            </section>
        </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(template);
    const component = fragment.querySelector('.wrapper');

    document.body.appendChild(component)

    const devtools = component.querySelector('#devtools');
    const actions = devtools.querySelector('#actions');
    const tools = devtools.querySelector('#tools');
    const exauth = tools.querySelector('#auth-exit');
    const noauth = tools.querySelector('#no-auth');
    const logout = tools.querySelector('#logout');

    let hold1

    document.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (!hold1) {
            hold1 = true;
            return;
        };
        
        if (hold1 && e.key.toLowerCase() === 'd') {
            component.classList.toggle('show');
        };
    });

    document.addEventListener('keyup', (e) => {
        e.stopPropagation();

        if (e.key.toLowerCase() === '1') hold1 = false;
    });

    if (actions) {
        let isGrabbed, isClicked;
        let posX = 0;
        let posY = 0;

        actions.addEventListener('mousedown', (e) => {
            e.stopPropagation();

            isClicked = true;

            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const rect = actions.getBoundingClientRect();

            posX = mouseX - rect.left;
            posY = mouseY - rect.top;

            document.body.style.userSelect = 'none';
        });

        actions.addEventListener('mousemove', (e) => {
            e.stopPropagation();

            if (isClicked) isGrabbed = true;

            if (isGrabbed && isClicked) {
                component.style.top = `${e.clientY - posY}px`;
                component.style.left = `${e.clientX - posX}px`;
            };
        });

        actions.addEventListener('mouseup', (e) => {
            e.stopPropagation();

            if (isClicked && !isGrabbed && tools) {
                tools.classList.toggle('open');
                isClicked = false;

                return;
            };

            isGrabbed = false; isClicked = false;

            actions.style.top = '';
            actions.style.left = '';
            document.body.style.userSelect = '';
        });

        actions.addEventListener('mouseleave', (e) => {
            e.stopPropagation();

            isGrabbed = false; isClicked = false;
        });

        // actions.addEventListener('click', () => {
        //     if (tools && !isGrabbed) {
        //         tools.classList.toggle('open');
        //     }
        // });
    };

    if (exauth) {
        exauth.addEventListener('click', () => {
            const page_auth = document.querySelector('#page_auth');
            const page_dashboard = document.querySelector('#page_dashboard .container');

            if (page_auth && page_dashboard) {
                if (!page_auth.classList.contains('exit-animation-out')) {
                    page_auth.classList.remove('exit-animation-in');
                    page_auth.classList.add('exit-animation-out');
                    page_dashboard.classList.add('show');

                    return;
                }

                if (!page_auth.classList.contains('exit-animation-in')) {
                    page_auth.classList.remove('exit-animation-out');
                    page_auth.classList.add('exit-animation-in');
                    page_dashboard.classList.remove('show');
                };
            };
        });
    };

    if (noauth) {
        noauth.addEventListener('click', () => {
            const page_auth = document.querySelector('#page_auth');

            if (page_auth) {
                const parent = page_auth.parentElement;

                if (parent && parent.contains(page_auth)) parent.removeChild(page_auth);
            };
        });
    };

    if (logout) {
        logout.addEventListener('click', () => {
            const account = StorageHandler.GetStorage(true);

            account.insession = false;
            StorageHandler.UpdateStorage({ isLogout: true });
            window.location.href = './auth.html';
        });
    };
}();

export default DevTools