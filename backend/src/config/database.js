require("dotenv").config();

console.log("DB_PASS:", process.env.DB_PASS);

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS || null,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
};
