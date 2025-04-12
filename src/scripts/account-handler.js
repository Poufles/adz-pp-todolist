import DateHandler from "./date-handler.js";
import StorageHandler from "./storage-handler.js";

const AccountHandler = function() {
    /**
     * Handles the register of new accounts.
     * @param {String} username - New account's username
     * @param {String} password - New account's password 
     */
    const register = (username, password) => {
        let isSuccessful;

        const storage = StorageHandler.GetStorage();
        const accountStorage = storage.app.account;

        for (let index = 0; index < accountStorage.length; index++) {
            const account = accountStorage[index];

            if (account.username === username) {
                isSuccessful = false;
                return isSuccessful;
            };
        };

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

    const login = () => {
        
    };

    const update = () => {

    };

    const destroy = () => {

    };

    return {
        register,
        login,
        update,
        destroy
    };
}();

export default AccountHandler;