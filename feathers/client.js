import SocketClient from 'socket.io-client';
import Feathers from 'feathers-client';

export default class FeathersClient {
  constructor() {
    this.socket = new SocketClient();
    this.feathers = Feathers().configure(Feathers.socketio(this.socket));
  }

  addService(params) {
    let service = this.feathers.service(params.name);
    for (let callbackName of ['created', 'updated', 'removed']) {
      let callback = params[callbackName];
      if (typeof callback === 'function') service.on(callbackName, callback);
    }
    return service;
  }
}
