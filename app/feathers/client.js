import SocketClient from 'socket.io-client';
import Feathers from 'feathers-client';

export default class FeathersClient {
  constructor() {
    this.socket = new SocketClient();
    this.feathers = Feathers().configure(Feathers.socketio(this.socket));
    this.posts = this.feathers.service('posts');

    this.posts.on('created', (post) => { console.log('created', post) });
    this.posts.on('updated', (post) => { console.log('updated', post) });
    this.posts.on('removed', (post) => { console.log('removed', post) });

    this.posts.find((err, posts) => {
      console.log(posts);
    });
  }
}
