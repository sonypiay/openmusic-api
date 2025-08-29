import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";
import ResponseException from "../exception/ResponseException.js";
import FileUpload from "../helper/FileUpload.js";
import StorageHelper from "../helper/StorageHelper.js";

class AlbumService {
    constructor() {
        this.albumRepository = new AlbumRepository;
        this.storageHelper = new StorageHelper;
    }

    /**
     * Get album by ID
     * @param id
     * @returns {Promise<{data: {album: *}}>}
     */
    async getById (id) {
        const result = await this.albumRepository.getById(id);

        if( ! result ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        result.coverUrl = this.storageHelper.url(`cover/${result.coverUrl}`);

        return {
            data: {
                album: result,
            }
        };
     }

    /**
     * Create a new album
     *
     * @param data
     * @returns {Promise<{data: {albumId: string}}>}
     */
     async create (data) {
        data.id = uuidv4();

        const result = await this.albumRepository.create(data);

        return {
            data: {
                albumId: result,
            },
        };
     }

    /**
     * Update existing album by ID
     *
     * @param id
     * @param data
     * @returns {Promise<void>}
     */
     async update (id, data) {
        const existsById = await this.albumRepository.existsById(id);

        if(!existsById) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.update(id, data);
     }

    /**
     * Delete existing album by ID
     *
     * @param id
     * @returns {Promise<void>}
     */
     async delete (id) {
        const existsById = await this.albumRepository.existsById(id);

        if( ! existsById ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.delete(id);
     }

    /**
     * Upload cover album
     *
     * @param id
     * @param file
     * @returns {Promise<void>}
     */
     async uploadCover(id, file) {
         const fileUpload = new FileUpload(file);
         const extensionList = [
             'image/jpeg',
             'image/png',
         ];

         if( ! fileUpload.getFilename() || fileUpload.getFilename() === '' ) {
             throw new ResponseException(400, 'fail', 'File is required');
         }

         if( ! fileUpload.isAllowedMimeType(extensionList) ) {
             throw new ResponseException(400, 'fail', 'Invalid upload file type. File must be image JPG or PNG');
         }

         if( await fileUpload.isOverSize(512000) ) {
             throw new ResponseException(413, 'fail', 'File size must be less than 1MB');
         }

        const existsById = await this.albumRepository.existsById(id);

        if( ! existsById ) {
            throw new ResponseException(404, 'fail', 'Album not found');
        }

        await this.albumRepository.updateCover(id, fileUpload.hashName());
        fileUpload.store('cover');
     }
}

export default AlbumService;