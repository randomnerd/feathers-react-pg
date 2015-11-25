import actions from 'cerebral/actions';
import heroActions from 'actionhero/actions';

export default function(controller) {
  controller.signal('appStarted', [heroActions.connectChain]);
  controller.signal('homeOpened', [actions.setPage('home')]);
  controller.signal('adminHomeOpened', [actions.setAdminPage('home')]);

  controller.signal('postsOpened', [
    actions.setTitle('Posts index'),
    actions.setPage('posts'),
    // actions.setLoading(true),
    // [
    //   heroActions.load('post'), {
    //     success: [
    //       heroActions.set('post'),
    //       actions.setLoading(false)
    //     ]
    //   }
    // ]
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
      heroActions.create('post'), {
        success: [heroActions.created]
      }
    ]
  ]);
  controller.signal('updatePost', [
    [
      heroActions.update('post'), {
        success: [heroActions.updated]
      }
    ]
  ]);
  controller.signal('removePost', [
    [
      heroActions.remove('post'), {
        success: [heroActions.removed]
      }
    ]
  ]);

  controller.signal('loadUsers', [heroActions.load('users')]);
}
