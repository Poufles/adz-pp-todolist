const SessionHandler = function () {
    const validateSession = () => {
        window.location.href = '/auth.html';
    };

    return {
        validateSession
    };
}();

export default SessionHandler;

// CHANGE ALL OF THIS LATER WHEN AUTH IS DONE