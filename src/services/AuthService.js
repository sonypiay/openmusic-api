import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import UserRepository from "../repositories/UserRepository.js";
import UnauthorizedException from "../exception/UnauthorizedException.js";
import SessionsRepository from "../repositories/SessionsRepository.js";
import JwtHelper from "../helper/JwtHelper.js";
import BadRequestException from "../exception/BadRequestException.js";

class AuthService {
    constructor() {
        this.userRepository = new UserRepository;
        this.sessionsRepository = new SessionsRepository;
    }

    getJwtPayload(user_id) {
        return {
            session_id: uuidv4(),
            user_id: user_id,
        };
    }

    async login(username, password) {
        const users = await this.userRepository.login(username);
        if( ! users ) throw new UnauthorizedException('Invalid username or password');

        const isPasswordValid = await bcrypt.compare(password, users.password);
        if( ! isPasswordValid ) throw new UnauthorizedException('Invalid username or password');

        const jwtHelper = new JwtHelper();
        jwtHelper.setPayload(this.getJwtPayload(users.id));

        await this.sessionsRepository.create({
            user_id: users.id,
            token: jwtHelper.getRefreshToken(),
        });

        return {
            data: {
                accessToken: jwtHelper.getAccessToken(),
                refreshToken: jwtHelper.getRefreshToken(),
            },
        };
    }

    async updateToken(refreshToken) {
        const verifyToken = await this.sessionsRepository.verifyToken(refreshToken);
        if( ! verifyToken ) throw new BadRequestException('Invalid token');

        const jwtHelper = new JwtHelper;
        jwtHelper.setPayload(this.getJwtPayload(verifyToken.user_id));

        return {
            data: {
                accessToken: jwtHelper.getAccessToken(),
            },
        };
    }

    async logout(refreshToken) {
        const verifyToken = await this.sessionsRepository.verifyToken(refreshToken);
        if( ! verifyToken ) throw new BadRequestException('Invalid token');

        await this.sessionsRepository.deleteToken(refreshToken);
    }
}

export default AuthService;