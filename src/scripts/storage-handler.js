const StorageHandler = function() {
    if (!localStorage.getItem('watodoLocalStorage')) {
        const storageTemplate = { app: { accounts: [], settings: { darkmode: false, clicksounds: true, hoversounds: true, ambientsounds: true } } };

        localStorage.setItem('watodoLocalStorage', JSON.stringify(storageTemplate));
    };
    
    const localStore = JSON.parse(localStorage.getItem('watodoLocalStorage'));

    const getLocalStorage = () => localStore;
    
    const updateLocalStorage = () => {
        const newData = JSON.stringify(localStore);
        localStorage.setItem('watodoLocalStorage', newData);
    };

    return {
        getLocalStorage,
        updateLocalStorage
    };
}();

export default StorageHandler;