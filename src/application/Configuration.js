export default {
    environment: process.env.NODE_ENV,
    application: {
        protocol: process.env.PROTOCOL ?? 'http',
        host: process.env.HOST ?? 'localhost',
        port: process.env.PORT ?? 5000,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM,
    },
    rabbitmq: {
        host: process.env.RABBITMQ_HOST ?? 'localhost',
        timeout: process.env.RABBITMQ_TIMEOUT ?? 5000,
        port: process.env.RABBITMQ_PORT ?? 5672,
        virtualHost: process.env.RABBITMQ_VIRTUALHOST ?? '/',
    },
    jwt: {
        algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
        accessToken: {
            secret: process.env.JWT_ACCESS_TOKEN_KEY,
            expiresIn: process.env.JWT_ACCESS_TOKEN_AGE ?? '1h',
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
            expiresIn: process.env.JWT_REFRESH_TOKEN_AGE ?? '1h',
        },
    },
    storage: {
        type: process.env.STORAGE_TYPE ?? 'local',
        local: {
            path: process.env.STORAGE_PATH ?? 'storage',
        },
    },
}