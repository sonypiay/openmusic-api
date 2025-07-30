import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import UserRepository from "../repositories/UserRepository.js";
import UnauthorizedException from "../exception/UnauthorizedException.js";
import SessionsRepository from "../repositories/SessionsRepository.js";
import TokenHelper from "../helper/TokenHelper.js";
import BadRequestException from "../exception/BadRequestException.js";

class AuthService {

    constructor() {
        this.userRepository = new UserRepository;
        this.sessionsRepository = new SessionsRepository;
        this.tokenHelper = new TokenHelper;
    }

    /**
     * Login user
     *
     * @param username
     * @param password
     * @returns {Promise<{data: {accessToken: string, refreshToken: string}}>}
     */
    async login(username, password) {
        const users = await this.userRepository.login(username);
        if( ! users )
            throw new UnauthorizedException('Invalid username or password');

        if( ! await bcrypt.compare(password, users.password) )
            throw new UnauthorizedException('Invalid username or password');

        this.tokenHelper.setPayload({
            session_id: uuidv4(),
            user_id: users.id,
        });

        await this.sessionsRepository.create({
            user_id: users.id,
            token: this.tokenHelper.getRefreshToken(),
        });

        return {
            data: {
                accessToken: this.tokenHelper.getAccessToken(),
                refreshToken: this.tokenHelper.getRefreshToken(),
            },
        };
    }

    async updateToken(refreshToken) {
        if( ! await this.sessionsRepository.verifyToken(refreshToken) ) throw new BadRequestException('Token not found');

        const verifyToken = this.tokenHelper.verifyToken(refreshToken, 'refresh');

        this.tokenHelper.setPayload({
            session_id: uuidv4(),
            user_id: verifyToken.user_id,
        });

        return {
            data: {
                accessToken: this.tokenHelper.getAccessToken(),
            },
        };
    }

    async logout(refreshToken) {
        if( ! await this.sessionsRepository.verifyToken(refreshToken) ) throw new BadRequestException('Invalid token');
        await this.sessionsRepository.deleteToken(refreshToken);
    }
}

export default AuthService;