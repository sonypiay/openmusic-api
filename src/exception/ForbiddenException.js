import ResponseException from "./ResponseException.js";

class ForbiddenException extends ResponseException {
    constructor(message) {
        super(403, 'fail', message);
    }
}

export default ForbiddenException;