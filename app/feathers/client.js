import SocketClient from 'socket.io-client';
import Feathers from 'feathers-client';

export default class FeathersClient {
  constructor() {
    this.socket = new SocketClient();
    this.feathers = Feathers().configure(Feathers.socketio(this.socket));
  }

  addService(params) {
    let {name, created, updated, removed} = {params};
    let service = this.feathers.service(name);
    if (typeof created === 'function') service.on('created', created);
    if (typeof updated === 'function') service.on('updated', updated);
    if (typeof removed === 'function') service.on('removed', removed);
    return service;
  }
}
