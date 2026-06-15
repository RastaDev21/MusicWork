"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("works", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("works", "contact", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("works", "category");
    await queryInterface.removeColumn("works", "contact");
  },
};
