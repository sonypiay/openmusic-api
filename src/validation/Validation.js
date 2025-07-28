import ResponseException from "../exception/ResponseException.js";

class Validation {
    validate(schema, request) {
        const result = schema.validate(request, {
            abortEarly: false,
            allowUnknown: true,
        });

        if( result.error ) {
            throw new ResponseException(400, 'fail', result.error.message);
        }

        return result.value;
    }
}

export default Validation;