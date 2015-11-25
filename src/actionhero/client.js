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
    this.client.action(this.name + 'Destroy', {apiVersion: 1, query}, (data) => {
      data.error ? callback(data.error) : callback(null, data.count);
    });
  }
}

export default class ActionHero {
  constructor(services) {
    this.services = {};
    this.data = {};
    this.subscriptions = [];
    this.url = window.location.origin.replace(/\:3000/, ':8080');
    this.client = new ActionheroClient({url: this.url});
    for (let service of services) { this.addService(service); };
    this.client.on('message', this.onData.bind(this));
  }

  onData(payload) {
    let {e: event, s: subscription, c: branch, d: data} = payload;
    if (!event) return;

    switch (event) {
    case 'ps:c': return this._onPubSubCreate(branch, data);
    case 'ps:u': return this._onPubSubUpdate(branch, data);
    case 'ps:r': return this._onPubSubRemove(branch, data);
    default    : return;
    }
  }

  _onPubSubCreate(branch, data) {
    console.log('onCreate', branch, data);

    this.controller.signals.aHero.created({service: branch, model: data});

    if (!this.data[branch]) return this.data[branch] = [data];

    let pos = _.findIndex(this.data[branch], _.matches(data));
    if (pos !== -1) return;
    this.data[branch].push(data);
  }

  _onPubSubUpdate(branch, {query, data}) {
    console.log('onUpdate', branch, query, data);

    this.controller.signals.aHero.updated({service: branch, model: data, query});

    if (!this.data[branch]) return;

    let newItems = _.map(this.data[branch], (item) => {
      if (_.matches(query)(item)) item = _.merge(_.clone(item), data);
      return item;
    });

    this.data[branch] = newItems;
  }

  _onPubSubRemove(branch, query) {
    console.log('onRemove', branch);

    this.controller.signals.aHero.removed({service: branch, query});

    if (!this.data[branch]) return;

    this.data[branch] = _.reject(this.data[branch], _.matches(query));
  }

  addService(name) {
    this.services[name] = new ActionHeroService(name, this.client);
    //this.client.service('/api/' + name);
    return this.services[name];
  }

  subscribe(name, callback) {
    this.client.action('subscribe', {name}, (data) => {
      if (data.error) return callback(data.error);
      this.subscriptions.push(name);
      callback(data);
    });
  }

  unsubscribe(name, callback) {
    this.client.action('unsubscribe', {name}, (data) => {
      if (data.error) return callback(data.error);
      let pos = this.subscriptions.indexOf(name);
      if (pos === -1) return callback(new Error('Not subscribed'));
      this.subscriptions.splice(pos, 1);
      callback(data);
    });
  }

  setupController(controller) {
    this.controller = controller;
    controller.services.aHero = {_client: this.client};
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
