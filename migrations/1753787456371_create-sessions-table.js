/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('sessions', {
        id: {
            type: 'varchar(36)',
            primaryKey: true,
        },
        user_id: {
            type: 'varchar(36)',
            notNull: true,
        },
        token: {
            type: 'text',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            notNull: true
        }
    });

    pgm.addConstraint('sessions', 'sessions_user_id_foreign', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addIndex('sessions', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('sessions', {
        ifExists: true
    });
};
