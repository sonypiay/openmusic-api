import AlbumService from "../services/AlbumService.js";
import AlbumValidation from "../validation/AlbumValidation.js";

class AlbumController {
    constructor() {
        this.albumService = new AlbumService;
        this.validate = new AlbumValidation;
    }

    /**
     * Get album by ID
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getById (req, res){
        const { id } = req.params;

        const result = await this.albumService.getById(id);

        return res.response({
            status: "success",
            ...result,
        }).code(200);
    }

    /**
     * Create a new album
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async create (req, res) {
        const payload = this.validate.createOrUpdate(req.payload);
        const result = await this.albumService.create(payload);

        return res.response({
            status: "success",
            ...result,
        }).code(201);
    }

    /**
     * Update existing album by ID
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async update (req, res) {
        const { id } = req.params;
        const payload = this.validate.createOrUpdate(req.payload);
        await this.albumService.update(id, payload);

        return res.response({
            status: "success",
            message: "Album has been updated",
        }).code(200);
    }

    /**
     * Delete existing album
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async delete (req, res) {
        const { id } = req.params;
        await this.albumService.delete(id);

        return res.response({
            status: "success",
            message: "Album has been deleted",
        });
    }
}

export default new AlbumController;