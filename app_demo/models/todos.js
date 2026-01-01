const { DataTypes } = require('sequelize');

module.exports = function (app) {
  const Todo = app.locals.db.define('Todo', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description cannot be empty"
        },
        len: {
          args: [10, 255],
          msg: "Description must be between 10 and 255 characters"
        }
      }
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  return Todo;
}
