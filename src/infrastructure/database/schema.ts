import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  serverId: text('server_id'),
  name: text('name').notNull(),
  checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
  syncStatus: text('sync_status', { enum: ['pending', 'synced', 'failed'] })
    .notNull()
    .default('pending'),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
});
