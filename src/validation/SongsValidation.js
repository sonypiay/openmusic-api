import Validation from "./Validation.js";
import Joi from "joi";

class SongsValidation extends Validation {
    createOrUpdate(request) {
        const schema = Joi.object({
            title: Joi.string().max(255).required(),
            year: Joi.number().required(),
            genre: Joi.string().max(255).required(),
            performer: Joi.string().max(255).required(),
            duration: Joi.number().optional(),
            albumId: Joi.string().optional(),
        });

        return this.validate(schema, request);
    }
}

export default SongsValidation;