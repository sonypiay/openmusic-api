import ResponseException from "./ResponseException.js";

class BadRequestException extends ResponseException {
    constructor(message) {
        super(400, 'fail', message);
    }
}

export default BadRequestException;