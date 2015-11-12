import actions from 'cerebral/actions';

export default function(controller) {
  controller.signal('homeOpened', [actions.setPage('home')]);
  controller.signal('adminHomeOpened', [actions.setAdminPage('home')]);
}
