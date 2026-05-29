import { Sequelize } from "sequelize";

const sequelize = new Sequelize("musicwork", "postgres", "", {
  host: "127.0.0.1",
  port: 5433,
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch(error => {
    console.log("❌ Database error:", error);
  });

export default sequelize;
