import _ from 'lodash';
import EventEmitter from 'events';

export const actions = {
  load(service) {
    return function load(input, state, output, {aHero}) {
      let models = state.get(['data', service]);
      if (models) return output.success({models});
      console.log('aHero.load', service);
      aHero[service].find((err, items) => {
        output.success({models: items});
      });
    }
  },

  loadOne(service) {
    return function loadOne(input, state, output, {aHero}) {
      let models = state.get(['data', service]) || [];
      let model = _.find(models, (p) => { return p.id == input.id; });
      if (model) return output.success({model});
      aHero[service].get(input.id, {}, (err, model) => {
        console.log('aHero.loadOne', service);
        err ? output.error(err) : output.success({model});
      })
    }
  },

  set(service) {
    return function set(input, state, output, {aHero}) {
      state.set(['data', service], input.models);
    }
  },

  create(service) {
    return function create(input, state, output, {aHero}) {
      console.log('aHero.create', service, input.model);
      aHero[service].create(input.model, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  created(input, state) {
    console.log('aHero.created', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    state.set(path, serviceData.concat([input.model]));
  },

  remove(service) {
    return function remove(input, state, output, {aHero}) {
      console.log('aHero.remove', service, input.model);
      aHero[service].remove(input.model.id, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  removed(input, state) {
    console.log('aHero.removed', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let newData = _.filter(serviceData, (model) => {
      return model.id !== input.model.id;
    });
    state.set(path, newData);
  },

  update(service) {
    return function update(input, state, output, {aHero}) {
      aHero[service].update(input.model.id, input.model, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  updated(input, state) {
    console.log('aHero.updated', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let newData = _.filter(serviceData, (model) => {
      return model.id !== input.model.id;
    });
    state.set(path, newData.concat([input.model]));
  },

  connect(input, state, output, {aHero}) {
    aHero._client.connect((err) => {
      console.log('ah connected');
      aHero._client.configure((info) => {
        console.log('ah configured', info);
      })
    })
  },

  login(input, state, output, {aHero}) {
    let {username, password} = input;
    aHero._client.action('login', {apiVersion: 1, username, password}, (data) => {
      data.error ? output.error(data) : output.success(data);
    });
  },

  setUser(input, state) {
    state.set(['user'], input.user);
  },

  setToken(input, state, output, {aHero}) {
    if (!input.token) return;
    let user = state.get(['user']);
    let {token} = input;

    state.set(['token'], token);
    localStorage.setItem('authToken', token);
  },

  loginWithToken(input, state, output, {aHero}) {
    let token = input.token || localStorage.getItem('authToken');
    if (!token) return output.error(new Error('No token provided'));

    aHero._client.action('loginWithToken', { apiVersion: 1, token }, (data) => {
      data.error ? output.error(data) : output.success(data);
    });
  },

  logout(input, state) {
    state.set(['user'], null);
    state.set(['token'], null);
    localStorage.removeItem('authToken');
  }
};

class ActionHeroService extends EventEmitter {
  constructor(name, client) {
    super(...arguments);
    this.client = client;
    this.name = name;
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
