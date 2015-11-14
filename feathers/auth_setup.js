import feathersPassport from 'feathers-passport-jwt';
import UserService from './services/user_service';

export default function(app) {
  app.configure(feathersPassport({
    secret: 'feathers-secret' // FIXME: change to something secure
  }));
  app.use('/api/users', UserService);
  app.service('/api/users').before({
    create: feathersPassport.hooks.hashPassword()
  });
}
