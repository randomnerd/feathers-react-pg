import SocketClient from 'socket.io-client';
import Feathers from 'feathers-client';

export const Actions = {
  load(service) {
    return function load(input, state, output, {feathers}) {
      let models = state.get(['data', service]);
      if (models) return output.success({models});
      console.log('feathers.load', service);
      feathers[service].find((err, items) => {
        output.success({models: items});
      });
    }
  },

  loadOne(service) {
    return function loadOne(input, state, output, {feathers}) {
      let models = state.get(['data', service]) || [];
      let model = _.find(models, (p) => { return p.id == input.id; });
      if (model) return output.success({model});
      feathers[service].get(input.id, {}, (err, model) => {
        console.log('feathers.loadOne', service);
        err ? output.error(err) : output.success({model});
      })
    }
  },

  set(service) {
    return function set(input, state, output, {feathers}) {
      state.set(['data', service], input.models);
    }
  },

  create(service) {
    return function create(input, state, output, {feathers}) {
      console.log('feathers.create', service, input.model);
      feathers[service].create(input.model, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  created(input, state) {
    console.log('feathers.created', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    state.set(path, serviceData.concat([input.model]));
  },

  remove(service) {
    return function remove(input, state, output, {feathers}) {
      console.log('feathers.remove', service, input.model);
      feathers[service].remove({id: input.model.id}, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  removed(input, state) {
    console.log('feathers.removed', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let newData = _.filter(serviceData, (model) => {
      return model.id !== input.model.id;
    });
    state.set(path, newData);
  },

  update(service) {
    return function update(input, state, output, {feathers}) {
      feathers[service].update(input.model.id, input.model, {}, (err, model) => {
        err ? output.error(err) : output.success({model});
      });
    }
  },

  updated(input, state) {
    console.log('feathers.updated', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let newData = _.filter(serviceData, (model) => {
      return model.id !== input.model.id;
    });
    state.set(path, newData.concat([input.model]));
  },

  login(input, state, output, {feathers}) {
    $.post('/api/login', input, (error, result) => {
      error ? output.error({error}) : output.success(result);
    });
  },

  setUser(input, state) {
    console.log('setUser', input);
    state.set(['user'], input.data);
    state.set(['token'], input.token);
  },

  logout(input, state) {
    state.set(['user'], null);
    state.set(['token'], null);
  }
};

export default class FeathersClient {
  constructor(services) {
    this.services = {};
    this.socket = new SocketClient();
    this.feathers = Feathers().configure(Feathers.socketio(this.socket));
    for (let service of services) { this.addService(service); };
  }

  addService(name) {
    this.services[name] = this.feathers.service('/api/' + name);
    return this.services[name];
  }

  setupController(controller) {
    controller.services.feathers = {};
    for (let serviceName of Object.keys(this.services)) {
      let service = this.services[serviceName];
      controller.services.feathers[serviceName] = service;
      for (let callbackName of ['created', 'updated', 'removed']) {
        service.on(callbackName, (model) => {
          controller.signals.feathers[callbackName]({
            service: serviceName,
            model: model
          });
        });
      }
    }
    controller.signal('feathers.created', [Actions.created]);
    controller.signal('feathers.updated', [Actions.updated]);
    controller.signal('feathers.removed', [Actions.removed]);
    controller.signal('feathers.login', [
      [
        Actions.login,
        { success: [Actions.setUser] }
      ]
    ]);
    return controller;
  }
}
