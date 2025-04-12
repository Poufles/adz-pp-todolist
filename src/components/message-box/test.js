const windowcomp = document.querySelector('.message-box');
const titlebar = windowcomp.querySelector('#title-bar');
let isGrabbing = false;
let offsetX = 0;
let offsetY = 0;


titlebar.addEventListener('mousedown', (e) => {
    e.stopPropagation();

    isGrabbing = true;
    offsetX = e.clientX - windowcomp.offsetLeft;
    offsetY = e.clientY - windowcomp.offsetTop;
    titlebar.classList.add('grabbing');
});

titlebar.addEventListener('mouseup', (e) => {
    e.stopPropagation();

    isGrabbing = false;
    titlebar.classList.remove('grabbing');
});

titlebar.addEventListener('mouseleave', (e) => {
    e.stopPropagation();

    isGrabbing = false;
    titlebar.classList.remove('grabbing');
});

titlebar.addEventListener('mousemove', (e) => {
    e.stopPropagation();

    if (!isGrabbing) return;

    windowcomp.style.left = `${e.clientX - offsetX}px`;
    windowcomp.style.top = `${e.clientY - offsetY}px`;
});