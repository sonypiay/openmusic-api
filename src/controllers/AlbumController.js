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

    /**
     * Upload cover album
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async uploadCover(req, res) {
        const id = req.params.id;
        const uploadCover = req.payload.cover;

        const result = await this.albumService.uploadCover(id, uploadCover);

        return res.response({
            status: "success",
            message: "Cover has been uploaded",
            ...result,
        }).code(201);
    }

    /**
     * Add like album
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async addLike(req, res) {
        const id = req.params.id;
        const userId = req.auth.credentials.user_id;
        await this.albumService.addLike(id, userId);

        return res.response({
            status: "success",
            message: "Album has been liked",
        }).code(201);
    }

    /**
     * Remove like album
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async removeLike(req, res) {
        const id = req.params.id;
        const userId = req.auth.credentials.user_id;
        await this.albumService.removeLike(id, userId);

        return res.response({
            status: "success",
            message: "Album has been unliked",
        });
    }

    /**
     * Get like count album
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getLikesCount(req, res) {
        const id = req.params.id;
        const result = await this.albumService.getLikesCount(id);

        const response = res.response({
            status: "success",
            data: {
                likes: result.likes,
            },
        });

        if( result.isCache === true ) {
            response.header("X-Data-Source", "cache");
        }

        return response;
    }
}

export default new AlbumController;