/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addColumn('albums', {
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()'),
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumn('albums', 'created_at');
    pgm.dropColumn('albums', 'updated_at');
};
