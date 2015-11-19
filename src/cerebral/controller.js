import Controller from 'cerebral';
import Model from 'cerebral-baobab';
import ActionHero from 'ah_client';

const model = Model({
  title: 'React starter kit',
  page: 'home',
  layout: 'main',
  loading: false,
  data: {},
  user: null
});

const aHero = window.aHero = new ActionHero(['users', 'posts']);
const controller = window.controller = Controller(model);
export default aHero.setupController(controller);
