import actions from 'cerebral/actions';
import {actions as heroActions} from 'ah_client';

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
  controller.signal('removePost', [
    [
      heroActions.remove('posts'), {
        success: []
      }
    ]
  ]);
  controller.signal('loadUsers', [heroActions.load('users')]);
}
