/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
            notNull: true,
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'int',
            notNull: true,
        },
        genre: {
            type: 'varchar(255)',
            notNull: true,
        },
        performer: {
            type: 'varchar(255)',
            notNull: true,
        },
        duration: {
            type: 'int',
            notNull: false,
            default: 0,
        },
        album_id: {
            type: 'varchar(50)',
            notNull: false,
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
    pgm.dropTable('songs');
};
