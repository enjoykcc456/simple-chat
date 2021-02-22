import Sequelize from 'sequelize'

import sequelize from '../config/database.config'

const Message = sequelize.define('message', {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

export default Message
