import "reflect-metadata";
import { DataSource } from "typeorm";
import path from 'path';

const dataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: false,
  migrationsRun: true,
  entities: [
      "src/database/model/**/*{.js,.ts}"
  ],
  migrations: [
      "src/database/migrations/**/*{.js,.ts}"
  ],
  subscribers: [
      "src/database/subscriber/**/*{.js,.ts}"
  ]
});

export default dataSource;