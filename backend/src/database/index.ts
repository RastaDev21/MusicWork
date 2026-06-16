import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL as string, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || "musicwork",
      process.env.DB_USER || "postgres",
      process.env.DB_PASS || "",
      {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 5433,
        dialect: "postgres",
        logging: false,
      },
    );

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch(error => {
    console.log("❌ Database error:", error);
  });

export default sequelize;
