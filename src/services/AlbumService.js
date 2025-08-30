import { v4 as uuidv4 } from 'uuid';
import AlbumRepository from "../repositories/AlbumRepository.js";
import ResponseException from "../exception/ResponseException.js";
import StorageHelper from "../helper/StorageHelper.js";
import SongsRepository from "../repositories/SongsRepository.js";
import NotFoundException from "../exception/NotFoundException.js";
import StorageService from "./StorageService.js";
import * as fs from "node:fs";

class AlbumService {
    constructor() {
        this.albumRepository = new AlbumRepository;
        this.songsRepository = new SongsRepository;
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

        if( result.coverUrl ) {
            result.coverUrl = this.storageHelper.url(`cover/${result.coverUrl}`);
        }

        result.songs = await this.songsRepository.getSongByAlbumId(id);

        return {
            data: {
                album: result,
            },
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
     * @returns {Promise<{url: (string|null), name: string}>}
     */
     async uploadCover(id, file) {
         const getAlbum = await this.albumRepository.getById(id);
         const pathName = `cover`;

         if( ! getAlbum ) {
             throw new NotFoundException('Album not found');
         }

         if( getAlbum.coverUrl ) {
             this.storageHelper.delete(`${pathName}/${getAlbum.coverUrl}`);
         }

         const storageService = new StorageService;
         const dataFile = await storageService.upload(pathName, file);

         await this.albumRepository.updateCover(id, dataFile.name);

         return dataFile;
     }
}

export default AlbumService;