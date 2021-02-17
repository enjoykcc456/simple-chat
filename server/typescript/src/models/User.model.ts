import Sequelize from 'sequelize'

import sequelize from '../config/database.config'

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'must be a valid email address',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
})

export default User
