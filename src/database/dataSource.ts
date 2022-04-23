import "reflect-metadata";
import { DataSource } from "typeorm";
import path from 'path';

const dataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: false,
  migrationsRun: true,
  entities: [
      path.join(__dirname, 'model/', '**', '*{.js,.ts}"')
  ],
  migrations: [
    path.join(__dirname, 'migration/', '**', '*{.js,.ts}"')
  ],
  subscribers: [
    path.join(__dirname, 'subscriber/', '**', '*{.js,.ts}"')
  ]
});

export default dataSource;