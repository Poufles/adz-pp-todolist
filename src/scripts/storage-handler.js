const StorageHandler = function () {
    let appStorage;
    let appSessionStorage;

    const storageTemplate = {
        app: {
            account: [], collectible: [], setting: {
                darkmode: true,
                sound: {
                    all: true,
                    background: true,
                    click: true,
                    keyboard: true
                },
            }
        },
    };
    const LOCALSTORAGE = localStorage.getItem('storage-watodo');
    const SESSIONSTORAGE = sessionStorage.getItem('storage-watodo-session');

    // Initialize local storage
    if (LOCALSTORAGE) appStorage = JSON.parse(LOCALSTORAGE);
    else {
        appStorage = storageTemplate;

        const appStorageString = JSON.stringify(appStorage);
        localStorage.setItem('storage-watodo', appStorageString);
    };

    // Initialize session storage
    if (SESSIONSTORAGE) {
        // Create a reference of account in session
        // for easier update for local storage
        const accountList = appStorage.app.account;

        // Iterate over account list
        for (let index = 0; index < accountList.length; index++) {
            let account = accountList[index];

            // Verify if account is in session
            if (account.insession) {
                // Store account in session
                appSessionStorage = account;

                // Stringify runtime session storage
                const appSessionString = JSON.stringify(appSessionStorage);

                // Update session storage
                sessionStorage.setItem('storage-watodo-session', appSessionString);

                break;
            };
        };
    };

    /**
     * Retrieves the sollicited storage
     * @param {boolean} isSessionStorage - (Optional) Default false. A boolean parameter to check if the storage to retrieve is session storage.
     * @returns - An object containing information of the storage
     */
    const GetStorage = (isSessionStorage = false) => {
        if (isSessionStorage) return appSessionStorage;
        return appStorage;
    };

    /**
     * Updates storages
     * @param {Boolean} isLogin - (Optional) Default false. A boolean that verifies if the update is for login.
     * @param {Boolean} isLogout - (Optional) Default false. A boolean that verifies if the update is for logging out but also for deleting the account
     * @param {Boolean} isRegister - (Optional Default false. A bollean that verifies if the update is for creating a new account
     */
    const UpdateStorage = (options = { isLogin: false, isLogout: false, isRegister: false }) => {
        if (options.isRegister) {
            // Stringify app local storage
            const appStorageString = JSON.stringify(appStorage);

            // Set update to local storage browser
            localStorage.setItem('storage-watodo', appStorageString);

            return;
        };

        if (options.isLogout) {
            // Remove session storage on browser
            sessionStorage.removeItem('storage-watodo-session');
            // Reinitialise runtime session storage
            appSessionStorage = undefined;

            // Stringify app local storage
            const appStorageString = JSON.stringify(appStorage);

            // Set update
            localStorage.setItem('storage-watodo', appStorageString);

            return;
        };

        if (options.isLogin) {
            const accountsInStorage = appStorage.app.account;

            // Reiterate over accounts to see
            // who's in session
            for (let index = 0; index < accountsInStorage.length; index++) {
                const account = accountsInStorage[index];

                if (account.insession) {
                    // Update runtime session storage
                    // with account in session
                    appSessionStorage = account;
                    break;
                };
            };
        };

        // Stringify app session storage
        const appSessionString = JSON.stringify(appSessionStorage);

        // Set update to session storage browser 
        sessionStorage.setItem('storage-watodo-session', appSessionString);

        // Stringify app local storage
        const appStorageString = JSON.stringify(appStorage);

        // Set update to local storage browser
        localStorage.setItem('storage-watodo', appStorageString);
    };

    return {
        GetStorage,
        UpdateStorage,
    };
}();

export default StorageHandler;