const start = document.body.querySelector('#start');
const btn_new = start.querySelector('#new');
const btn_load = start.querySelector('#load');
const btn_settings = start.querySelector('#settings');
const interface = document.body.querySelector('.auth-interface')
const btn_cancel = interface.querySelector('#action-cancel');

btn_new.addEventListener('click', () => {
    start.classList.add('unshown')
    interface.style.display = 'block';
    setTimeout(() => {
        interface.classList.add('shown');
    }, 0);
});

btn_load.addEventListener('click', () => {
    start.classList.add('unshown')
    interface.style.display = 'block';
    setTimeout(() => {
        interface.classList.add('shown');
    }, 0);
});

btn_settings.addEventListener('click', () => {
    start.classList.add('unshown')
    interface.style.display = 'block';
    setTimeout(() => {
        interface.classList.add('shown');
    }, 0);
});

btn_cancel.addEventListener('click', () => {
    start.classList.remove('unshown')
    interface.classList.remove('shown');
    setTimeout(() => {
        interface.style.display = 'block';
    }, 200);
});