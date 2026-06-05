"use strict";

module.exports = {
  // "up" = o que fazer para AVANÇAR (adicionar as colunas)
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "avatarUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "coverUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  // "down" = o que fazer para VOLTAR ATRÁS (remover as colunas)
  async down(queryInterface) {
    await queryInterface.removeColumn("users", "avatarUrl");
    await queryInterface.removeColumn("users", "coverUrl");
  },
};
