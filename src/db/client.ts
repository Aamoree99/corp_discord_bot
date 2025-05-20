import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/env.js';
import * as schema from './schema.js';

const client = postgres(config.db, { max: 1 }); // подключение к БД
export const db = drizzle(client, { schema });  // экспорт ORM клиента
