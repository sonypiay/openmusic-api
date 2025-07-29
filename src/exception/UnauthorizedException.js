import ResponseException from "./ResponseException.js";

class UnauthorizedException extends ResponseException {
    constructor(message) {
        super(401, 'fail', message);
    }
}

export default UnauthorizedException;