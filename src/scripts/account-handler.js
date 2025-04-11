import DateHandler from "./date-handler";
import StorageHandler from "./storage-handler";

const AccountHandler = function() {
    /**
     * Handles the register of new accounts.
     * @param {String} username - New account's username
     * @param {String} password - New account's password 
     */
    const register = (username, password) => {
        const template = {
            username: '',
            password: '',
            level: 1,
            dateofcreation: 'mm/dd/yyyy',
            preference: {
                animation: true,
                darkmode: true,
                mousetrail: true,
                sound: {
                    all: true,
                    background: true,
                    click: true,
                    type: true
                },
            },
            collectibles: [],
            todo: [],
            sticky: [],
            project: [],
            archive: [],
            lastsession: 'hh/mm/ss @ dd/mm/yyyy',
            insession: false
        };

        const date = DateHandler.currentDate();
        const time = DateHandler.currentTime();

        template.username = username;
        template.password = password;
        template.dateofcreation = date;
        template.lastsession = `${time} @ ${date}`;

        const storage = StorageHandler.GetStorage();
        const accountStorage = storage.app.account;

        console.log(accountStorage);
        console.log(template);
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