import Validation from "./Validation.js";
import Joi from "joi";

class AlbumValidation extends Validation {
    createOrUpdate(request) {
        const schema = Joi.object({
            name: Joi.string().max(100).required(),
            year: Joi.number().required(),
        });

        return this.validate(schema, request);
    }
}

export default new AlbumValidation;