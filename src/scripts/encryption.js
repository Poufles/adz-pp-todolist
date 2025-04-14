import bcrypt from "bcryptjs";

const Encryption = function () {
    const saltRounds = 10;

    return {
        async hashPassword(password) {
            return await bcrypt.hash(password, saltRounds);
        },

        async verifyPassword(password, hash) {
            return await bcrypt.compare(password, hash);
        }
    };
}();

export default Encryption;