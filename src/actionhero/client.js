import _ from 'lodash';
import EventEmitter from 'events';
import actions from 'actionhero/actions';

class ActionHeroService extends EventEmitter {
  constructor(name, client) {
    super(...arguments);
    this.client = client;
    this.name = name;
  }

  find(query, callback) {
    this.client.action(this.name, {apiVersion: 1, query}, (data) => {
      data.error ? callback(data.error) : callback(null, data.models);
    });
  }

  get(id, query, callback) {
    this.client.action(this.name + 'Get', {apiVersion: 1, query}, (data) => {
      data.error ? callback(data.error) : callback(null, data.models);
    });
  }

  create(model, callback) {
    this.client.action(this.name + 'Create', {apiVersion: 1, model}, (data) => {
      data.error ? callback(data.error) : callback(null, data.model);
    });
  }

  update(query, model, callback) {
    this.client.action(this.name + 'Update', {apiVersion: 1, query, model}, (data) => {
      let {count, rows} = data;
      data.error ? callback(data.error) : callback(null, {count, rows});
    });
  }

  remove(query, callback) {
    this.client.action(this.name + 'Remove', {apiVersion: 1, query}, (data) => {
      data.error ? callback(data.error) : callback(null, data.count);
    });
  }
}

export default class ActionHero {
  constructor(services) {
    this.services = {};
    this.url = window.location.origin.replace(/\:3000/, ':8080');
    this.aHero = window.ah = new ActionheroClient({url: this.url});
    for (let service of services) { this.addService(service); };
  }

  addService(name) {
    this.services[name] = new ActionHeroService(name, this.aHero);
    //this.aHero.service('/api/' + name);
    return this.services[name];
  }

  setupController(controller) {
    controller.services.aHero = {_client: this.aHero};
    for (let serviceName of Object.keys(this.services)) {
      let service = this.services[serviceName];
      controller.services.aHero[serviceName] = service;
      for (let callbackName of ['created', 'updated', 'removed']) {
        service.on(callbackName, (model) => {
          controller.signals.aHero[callbackName]({
            service: serviceName,
            model: model
          });
        });
      }
    }
    controller.signal('aHero.created', [actions.created]);
    controller.signal('aHero.updated', [actions.updated]);
    controller.signal('aHero.removed', [actions.removed]);
    controller.signal('aHero.setUser', [actions.setUser]);
    controller.signal('aHero.setToken', [actions.setToken]);
    controller.signal('aHero.login', [
      [
        actions.login, {
          success: [actions.setUser, actions.setToken],
          error: []
        }
      ]
    ]);
    controller.signal('aHero.logout', [actions.logout]);

    return controller;
  }
}
