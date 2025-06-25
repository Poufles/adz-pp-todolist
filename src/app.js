import SessionHandler from "./scripts/session-handler.js";
import StorageHandler from "./scripts/storage-handler.js";

function Redirect() {
    SessionHandler.validateSession();
};

Redirect();

// CHANGE LATER AFTER ALL