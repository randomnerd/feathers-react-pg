import Sequelize from 'sequelize';
import ServiceFactory from '../service_factory';

let UserService = ServiceFactory('users', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  internal: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

export default UserService;
