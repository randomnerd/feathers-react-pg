import actions from 'cerebral/actions';
import heroActions from 'actionhero/actions';

export default function(controller) {
  controller.signal('appStarted', [heroActions.connectChain]);
  controller.signal('homeOpened', [actions.setPage('home')]);
  controller.signal('adminHomeOpened', [actions.setAdminPage('home')]);

  controller.signal('postsOpened', [
    actions.setTitle('Posts index'),
    actions.setPage('posts'),
    actions.setLoading(true),
    [
      heroActions.load('posts'), {
        success: [
          heroActions.set('posts'),
          actions.setLoading(false)
        ]
      }
    ]
  ]);
  controller.signal('postOpened', [
    actions.setPage('post'),
    // actions.setLoading(true),
    // [
    //   heroActions.loadOne('posts'), {
    //     success: [
    //       actions.setPost,
    //       actions.setLoading(false)
    //     ]
    //   }
    // ]
  ]);
  controller.signal('createPost', [
    [
      heroActions.create('posts'), {
        success: [heroActions.created]
      }
    ]
  ]);
  controller.signal('updatePost', [
    [
      heroActions.update('posts'), {
        success: [heroActions.updated]
      }
    ]
  ]);
  controller.signal('removePost', [
    [
      heroActions.remove('posts'), {
        success: [heroActions.removed]
      }
    ]
  ]);

  controller.signal('loadUsers', [heroActions.load('users')]);
}
