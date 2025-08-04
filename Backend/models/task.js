'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Task.init({
    title: DataTypes.STRING,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};