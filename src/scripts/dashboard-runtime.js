const DashboardRuntime = function() {
    const components = {};
    const objects = {};

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
            }
        },
        objects
    };
}();

export default DashboardRuntime;