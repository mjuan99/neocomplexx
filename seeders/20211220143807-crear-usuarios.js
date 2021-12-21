'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'juan@gmail.com',
      password: 'juan',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'luz@gmail.com',
      password: 'luz',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'nico@gmail.com',
      password: 'nico',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
