import actions from 'cerebral/actions';
import {actions as heroActions} from 'ah_client';

export default function(controller) {
  controller.signal('appStarted', [
    heroActions.connect,
    [heroActions.loginWithToken, {success: [heroActions.setUser, heroActions.setToken], error: []}]
  ]);
  controller.signal('homeOpened', [actions.setPage('home')]);
  controller.signal('adminHomeOpened', [actions.setAdminPage('home')]);

  controller.signal('postsOpened', [
    actions.setTitle('Posts index'),
    actions.setPage('posts'),
    // actions.setLoading(true),
    // [
    //   FeathersActions.load('posts'), {
    //     success: [
    //       FeathersActions.set('posts'),
    //       actions.setLoading(false)
    //     ]
    //   }
    // ]
  ]);
  controller.signal('postOpened', [
    actions.setPage('post'),
    // actions.setLoading(true),
    // [
    //   FeathersActions.loadOne('posts'), {
    //     success: [
    //       actions.setPost,
    //       actions.setLoading(false)
    //     ]
    //   }
    // ]
  ]);
}
