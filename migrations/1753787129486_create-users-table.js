/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
            notNull: true,
        },
        username: {
            type: 'varchar(100)',
            notNull: true,
        },
        password: {
            type: 'varchar(128)',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users', {
        ifExists: true,
    });
};
