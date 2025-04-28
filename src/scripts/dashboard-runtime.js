const DashboardRuntime = function() {
    const components = {};
    const objects = {};
    const switchPanel = ({ fromFinestra, toInterface, oppositeInterfacesNWindows }) => switchPanelAnimation({
        fromFinestra,
        toInterface,
        oppositeInterfacesNWindows
    });
    const refreshWindow = (arr, finestra, component) => RefreshWindow(arr, finestra, component);

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
        switchPanel,
        refreshWindow
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
    const rightContainer = componentActions.get('container-right-todo-1').component;
    const rightContainer2 = componentActions.get('container-right-todo-2').component;

    fromFinestra.animate('leave');
    toInterface.render(middlePanel);
    toInterface.animate('enter');
    
    let targetContainer;
    const container = fromFinestra.component.parentElement;

    if (container === leftContainer) {
        targetContainer = leftContainer;
    } else if (container === rightContainer) {
        targetContainer = rightContainer;
    } else {
        targetContainer = rightContainer2;
    };

    const {firstAlt, secondAlt, thirdAlt} = oppositeInterfacesNWindows;
    
    if (currentMiddlePanelChild === firstAlt.interface.component) {
        firstAlt.finestra.render(targetContainer);
        firstAlt.finestra.animate('enter');
        firstAlt.interface.animate('leave');
    } else if (currentMiddlePanelChild === secondAlt.interface.component) {
        secondAlt.finestra.render(targetContainer);
        secondAlt.finestra.animate('enter');
        secondAlt.interface.animate('leave');
    } else {
        thirdAlt.finestra.render(targetContainer);
        thirdAlt.finestra.animate('enter');
        thirdAlt.interface.animate('leave');
    }

    setTimeout(() => {
        fromFinestra.unrender();
    }, animateDuration);

    setTimeout(() => {
        firstAlt.interface.unrender();
        secondAlt.interface.unrender();
        thirdAlt.interface.unrender();
    }, animateDuration);
};

function RefreshWindow(arr, finestra, component) {
    finestra.removeContent();
    
    arr.forEach(element => {
        const newItem = component(element.information);

        finestra.addContent(newItem);
    });
};

export default DashboardRuntime;