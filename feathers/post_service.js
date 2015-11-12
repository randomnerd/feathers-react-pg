import Sequelize from 'sequelize';
import ServiceFactory from './service_factory';

let PostService = ServiceFactory('posts', {
  title: {
    type: Sequelize.STRING
  },
  body: {
    type: Sequelize.TEXT
  }
});

// PostService.created = function(data, params, callback) {
//   console.log(data, params, callback);
//   callback(null, data);
// };

export default PostService;
