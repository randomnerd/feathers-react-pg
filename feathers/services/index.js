import PostService from './post_service';

export default function setupServices(app) {
  app.use('/api/posts', PostService);
  app.service('/api/posts').before({
    create(hook, next) {
      console.log('createPost', hook);
      next();
    }
  })
}
