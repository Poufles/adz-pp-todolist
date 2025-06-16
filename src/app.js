import SessionHandler from "./scripts/session-handler.js";

function Redirect() {
    SessionHandler.validateSession();
};

Redirect();

// CHANGE LATER AFTER ALL