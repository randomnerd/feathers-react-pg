import Controller from 'cerebral';
import Model from 'cerebral-baobab';
import FeathersClient from 'feathers_client';

const model = Model({
  title: 'Feathers + React starter kit',
  page: 'home',
  layout: 'main',
  loading: false,
  data: {},
  user: null
});

const feathers = window.feathers = new FeathersClient(['posts']);
const controller = window.controller = Controller(model);
export default feathers.setupController(controller);
