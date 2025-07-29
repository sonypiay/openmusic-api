/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'int',
            notNull: true,
        }
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
    pgm.dropTable('albums');
};
