import actions from 'cerebral/actions';
import {Actions as FeathersActions} from 'feathers_client';

export default function(controller) {
  // controller.signal('appStarted', [actions.setupServices]);
  controller.signal('homeOpened', [actions.setPage('home')]);
  controller.signal('postsOpened', [
    actions.setTitle('Posts index'),
    actions.setPage('posts'),
    actions.setLoading(true),
    [
      FeathersActions.load('posts'), {
        success: [
          FeathersActions.set('posts'),
          actions.setLoading(false)
        ]
      }
    ]
  ]);
  controller.signal('postOpened', [
    actions.setPage('post'),
    actions.setLoading(true),
    [
      FeathersActions.loadOne('posts'), {
        success: [
          actions.setPost,
          actions.setLoading(false)
        ]
      }
    ]
  ]);
  controller.signal('adminHomeOpened', [actions.setAdminPage('home')]);

  controller.signal('createPost', [
    [
      FeathersActions.create('posts'), {
        success: []
      }
    ]
  ]);
  controller.signal('updatePost', [
    [
      FeathersActions.update('posts'), {
        success: []
      }
    ]
  ]);
  controller.signal('removePost', [
    [
      FeathersActions.remove('posts'), {
        success: []
      }
    ]
  ]);
}
