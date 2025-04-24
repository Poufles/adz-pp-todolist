const DashboardRuntime = function() {
    const components = {};
    const objects = {};
    const switchPanel = ({ fromFinestra, toInterface, oppositeInterfacesNWindows }) => switchPanelAnimation({
        fromFinestra,
        toInterface,
        oppositeInterfacesNWindows
    });

    return {
        componentActions: {
            add(id, component, object) {
                components[id] = {
                    component,
                    object
                };
            },
            get(id) {
                return components[id];
            },
            all() {
                return components;
            }
        },
        objectActions: {
            add(id, objectMethod) {
                objects[id] = objectMethod;
            },
            get(id) {
                return objects[id];
            },
            all() {
                return objects;
            }
        },
        switchPanel
    };
}();

function switchPanelAnimation({
    fromFinestra,
    toInterface,
    oppositeInterfacesNWindows,
}) {
    const animateDuration = 500;
    const componentActions = DashboardRuntime.componentActions;
    const middlePanel = componentActions.get('middle-panel').component;
    const currentMiddlePanelChild = middlePanel.firstElementChild;
    const leftContainer = componentActions.get('container-left-todo').component;
    const rightContainer = componentActions.get('container-right-todo').component;

    const isLeft = fromFinestra.component === leftContainer.firstElementChild;

    fromFinestra.animate('leave');
    toInterface.render(middlePanel);
    toInterface.animate('enter');

    const targetContainer = isLeft ? leftContainer : rightContainer;

    const {firstAlt, secondAlt} = oppositeInterfacesNWindows;

    if (currentMiddlePanelChild === firstAlt.interface.component) {
        firstAlt.finestra.render(targetContainer);
        firstAlt.finestra.animate('enter');
        firstAlt.interface.animate('leave');
    } else {
        secondAlt.finestra.render(targetContainer);
        secondAlt.finestra.animate('enter');
        secondAlt.interface.animate('leave');
    }

    setTimeout(() => {
        fromFinestra.unrender();
    }, animateDuration);

    setTimeout(() => {
        firstAlt.interface.unrender();
        secondAlt.interface.unrender();
    }, animateDuration);
};

export default DashboardRuntime;