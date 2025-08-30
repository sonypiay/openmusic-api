import { v4 as uuidv4 } from 'uuid';
import * as crypto from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import ResponseException from "../exception/ResponseException.js";
import Configuration from "../application/Configuration.js";

class FileUpload {
    constructor(file) {
        this.setFile(file);
        this.rootDirectory = Configuration.storage.local.path;
    }

    setFile(file) {
        this.file = file;
    }

    getFile() {
        return this.file;
    }

    getFilename() {
        return this.file.hapi.filename;
    }

    getHeaders() {
        return this.file.hapi.headers;
    }

    getMimeType() {
        return this.getHeaders()['content-type'];
    }

    getExtension() {
        return path.extname(this.getFilename());
    }

    getSize() {
        let size = 0;

        return new Promise((resolve, reject) => {
            this.file.on('data', (chunk) => {
                size += chunk.length;
            });

            this.file.on('end', () => {
                resolve(size);
            });

            this.file.on('error', (err) => {
                reject(err);
            });
        });
    }

    isAllowedMimeType(extension = []) {
        if( ! Array.isArray(extension) ) {
            throw new ResponseException(400, 'fail', 'Extension must be string');
        }

        return extension.includes(this.getMimeType());
    }

    async isOverSize(size) {
        return await this.getSize() > size;
    }

    exists(file) {
        return existsSync(path.join(this.rootDirectory, file ?? ''));
    }

    hashName() {
        const hashValue = crypto
            .createHash('md5')
            .update(`${uuidv4()}_${this.getFilename()}`)
            .digest('hex');

        return `${hashValue}${this.getExtension()}`;
    }
}

export default FileUpload;