export default {
  setLayout(layout) {
    return function setLayout(input, state) {
      state.set('layout', layout);
    };
  },

  setPage(page, layout) {
    return function setPage(input, state) {
      state.set('layout', layout || 'main');
      state.set('page', page);
    };
  },

  setAdminPage(page) {
    return function setPage(input, state) {
      state.set('layout', 'admin');
      state.set('page', page);
    };
  }
}
