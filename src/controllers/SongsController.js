import { v4 as uuidv4 } from 'uuid';
import SongsService from "../services/SongsService.js";
import SongsValidation from "../validation/SongsValidation.js";

class SongsController {
    constructor() {
        this.songsSevice = new SongsService;
        this.validate = new SongsValidation;
    }

    async getAll(req, res) {
        const result = await this.songsSevice.getAll(req);

        return res.response({
            status: "success",
            ...result,
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await this.songsSevice.getById(id);

        return res.response({
            status: "success",
            ...result,
        });
    }

    async create(req, res) {
        const payload = this.validate.createOrUpdate(req.payload);
        payload.id = uuidv4();

        const result = await this.songsSevice.create(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }

    async update(req, res) {
        const { id } = req.params;
        const payload = this.validate.createOrUpdate(req.payload);

        await this.songsSevice.update(id, payload);

        return res.response({
            status: "success",
            message: "Song has been updated",
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        await this.songsSevice.delete(id);

        return res.response({
            status: "success",
            message: "Song has been deleted",
        });
    }
}

export default new SongsController;