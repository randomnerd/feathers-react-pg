import PostService from './post_service';

export default function setupServices(app) {
  app.use('/api/posts', PostService);
}
