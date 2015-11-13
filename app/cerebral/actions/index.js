import _ from 'lodash';

export default {
  setPosts(input, state) {
    state.set(['data', 'posts'], input.posts);
  },

  setLoading(isLoading = true) {
    return function setLoading(input, state) {
      state.set('loading', isLoading);
    };
  },

  unsetLoading(input, state) {
    state.set('loading', false);
  },

  setPost(input, state) {
    state.set(['data', 'post'], input.model);
  },

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

  setTitle(title) {
    return function setTitle(input, state) {
      state.set('title', title);
    };
  },

  setAdminPage(page) {
    return function setPage(input, state) {
      state.set('layout', 'admin');
      state.set('page', page);
    };
  }
}
