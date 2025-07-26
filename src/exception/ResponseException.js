class ResponseException extends Error {
    constructor(statusCode, status, message) {
        super(message);
        this.status = status;
        this.statusCode = statusCode;
    }
}

export default ResponseException;