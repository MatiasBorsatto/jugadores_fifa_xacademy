import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
  },
  host: "mysql_db",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  port: 3306,
  username: "xacademy",
  password: "xacademyroot",
  database: "jugadores_fifa",
  logging: true, // o false si querés menos logs
});

export default sequelize;
