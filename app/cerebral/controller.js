import Controller from 'cerebral';
import Model from 'cerebral-baobab';
import FeathersClient from 'feathers_client';

const model = Model({
  title: 'Feathers + React starter kit',
  page: 'home',
  layout: 'main',
  loading: false,
  data: {}
});

const feathers = new FeathersClient(['posts']);
const controller = Controller(model);
export default feathers.setupController(controller);
