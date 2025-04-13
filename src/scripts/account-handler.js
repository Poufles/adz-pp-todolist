import DateHandler from "./date-handler.js";
import StorageHandler from "./storage-handler.js";

const AccountHandler = function() {
    /**
     * Handles the register of new accounts.
     * @param {String} username - New account's username.
     * @param {String} password - New account's password.
     * @returns A boolean value to indicate if the register is successful or not.
     */
    const register = (username, password) => {
        let isSuccessful = false;

        const storage = StorageHandler.GetStorage();
        const accountStorage = storage.app.account;

        if (isUsernameExist(username)) return isSuccessful;

        const template = {
            username: '',
            password: '',
            level: 1,
            dateofcreation: '',
            preference: {
                animation: true,
                darkmode: true,
                mousetrail: true,
                sound: {
                    all: true,
                    background: true,
                    click: true,
                    keyboard: true
                },
            },
            collectibles: [],
            todo: [],
            sticky: [],
            project: [],
            archive: [],
            completedcount: 0,
            lastsession: 'n/a',
            insession: false
        };

        const date = DateHandler.currentDate();

        template.username = username;
        template.password = password;
        template.dateofcreation = date;

        accountStorage.push(template);
        StorageHandler.UpdateStorage({ isRegister: true });

        isSuccessful = true;

        return isSuccessful;
    };

    /**
     * Handles the login of an account
     * @param {*} username - Account's username.
     * @param {*} password - Account's password.
     * @returns A boolean value to indicate if the register is successful or not.
     */
    const login = (username, password) => {
        let isSuccessful = false;
        
        return isSuccessful;
    };

    const update = (username) => {

    };

    const destroy = (username) => {

    };

    /**
     * Verifies if the username exists
     * @param {string} username - The username to be verified 
     * @returns A boolean value to tell if the username exists or not.
     */
    const isUsernameExist = (username) => {
        let isExist = true;

        const storage = StorageHandler.GetStorage();
        const accountStorage = storage.app.account;

        for (let index = 0; index < accountStorage.length; index++) {
            const account = accountStorage[index];

            if (account.username === username) {
                isExist = true;
                return isExist;
            };
        };
    };

    return {
        register,
        login,
        update,
        destroy,
        isUsernameExist
    };
}();

export default AccountHandler;