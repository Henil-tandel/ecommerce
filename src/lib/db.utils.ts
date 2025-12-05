import { Sequelize, QueryTypes } from 'sequelize';
import config from '../config/db.config';

interface DbConfig {
  DATABASE: string;
  DATABASE_USER_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
}
const dbConfig: DbConfig = config;

export const sequelize: Sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.DATABASE_USER_NAME,
  dbConfig.DATABASE_PASSWORD,
  {
    host: dbConfig.DATABASE_HOST,
    dialect: 'mysql',
    database: config.DATABASE,
    pool: { max: 5, min: 0, idle: 1000 },
  },
);

export const connect = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    console.log('Database ecommerce created or already exists.');

    await sequelize.authenticate();
    console.log('Connection established to the "Ecommerce" database.');

    await sequelize.sync(); 
    console.log('All Sequelize models are synced successfully.')
  } catch (err) {
    console.log(`Error in connection: ${err}`);
  }
};
