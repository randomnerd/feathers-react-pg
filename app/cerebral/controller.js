import Controller from 'cerebral';
import Model from 'cerebral-baobab';

const model = Model({
  title: 'Feathers + React starter kit',
  page: 'home',
  layout: 'main',
  loading: false
});

export default Controller(model);
