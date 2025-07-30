// import Jwt from '@hapi/jwt';
import jwt from 'jsonwebtoken';
import UnauthorizedException from "../exception/UnauthorizedException.js";
import ResponseException from "../exception/ResponseException.js";
import Logging from "../application/Logging.js";
import BadRequestException from "../exception/BadRequestException.js";

class TokenHelper {
    payload = undefined;

    constructor() {
        this.algorithm = process.env.JWT_ALGORITHM ?? 'HS256';
    }

    generateToken(key, expiry) {
        if( ! this.getPayload() ) throw new ResponseException(400, 'fail', 'Payload is required');

        return jwt.sign(this.getPayload(), key, {
            algorithm: this.algorithm,
            expiresIn: expiry,
        });
    }

    setPayload(payload) {
        this.payload = payload;
    }

    getPayload() {
        return this.payload;
    }

    getAccessToken() {
        return this.generateToken(
            process.env.JWT_ACCESS_TOKEN_KEY,
            process.env.JWT_ACCESS_TOKEN_AGE
        );
    }

    getRefreshToken() {
        return this.generateToken(
            process.env.JWT_REFRESH_TOKEN_KEY,
            process.env.JWT_REFRESH_TOKEN_AGE
        );
    }

    getDecodedPayload(token) {
        return jwt.decode(token);
    }

    verifyToken(token, type = 'access') {
        if( ! token ) throw new BadRequestException("Token is required");

        const key = type === 'access'
            ? process.env.JWT_ACCESS_TOKEN_KEY
            : process.env.JWT_REFRESH_TOKEN_KEY;

        try {
            jwt.verify(token, key);
            return this.getDecodedPayload(token);
        } catch (error) {
            Logging.error(error.message);

            throw new BadRequestException("Invalid token!");
        }
    }
}

export default TokenHelper;