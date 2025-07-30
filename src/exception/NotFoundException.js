import ResponseException from "./ResponseException.js";

class NotFoundException extends ResponseException {
    constructor(message) {
        super(404, 'fail', message);
    }
}

export default NotFoundException;